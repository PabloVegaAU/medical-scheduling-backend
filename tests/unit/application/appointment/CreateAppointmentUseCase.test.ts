import { AppointmentRepository } from "@/domain/appointment/AppointmentRepository";
import * as repoFactory from "@/application/appointment/AppointmentRepositoryFactory";
import { Appointment } from "@/domain/appointment/Appointment";
import { CreateAppointmentUseCase } from "@/application/appointment/CreateAppointmentUseCase";

describe("CreateAppointmentUseCase", () => {
  let mockRepoPE: jest.Mocked<AppointmentRepository>;
  let mockRepoCL: jest.Mocked<AppointmentRepository>;
  let useCase: CreateAppointmentUseCase;

  beforeEach(() => {
    mockRepoPE = {
      save: jest.fn(),
      findByInsuredId: jest.fn(),
      updateStatus: jest.fn(),
    };
    mockRepoCL = {
      save: jest.fn(),
      findByInsuredId: jest.fn(),
      updateStatus: jest.fn(),
    };

    // Mockear la función de fábrica para devolver el repositorio adecuado
    jest
      .spyOn(repoFactory, "getAppointmentRepository")
      .mockImplementation((region: string) => {
        if (region === "PE") return mockRepoPE;
        if (region === "CL") return mockRepoCL;
        throw new Error("Unsupported region");
      });

    useCase = new CreateAppointmentUseCase();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("debe guardar un appointment en repositorio PE si countryISO es PE", async () => {
    const input = {
      insuredId: "00001",
      scheduleId: 42,
      countryISO: "PE" as const,
    };

    await useCase.execute(input);

    expect(mockRepoPE.save).toHaveBeenCalledTimes(1);
    const saved = mockRepoPE.save.mock.calls[0][0];
    expect(saved.insuredId).toBe(input.insuredId);
    expect(saved.scheduleId).toBe(input.scheduleId);
    expect(saved.countryISO).toBe(input.countryISO);
    expect(saved.status).toBe("pending");
    expect(typeof saved.createdAt).toBe("string");

    expect(mockRepoCL.save).not.toHaveBeenCalled();
  });

  it("debe guardar un appointment en repositorio CL si countryISO es CL", async () => {
    const input = {
      insuredId: "00002",
      scheduleId: 43,
      countryISO: "CL" as const,
    };

    await useCase.execute(input);

    expect(mockRepoCL.save).toHaveBeenCalledTimes(1);
    const saved = mockRepoCL.save.mock.calls[0][0];
    expect(saved.insuredId).toBe(input.insuredId);
    expect(saved.scheduleId).toBe(input.scheduleId);
    expect(saved.countryISO).toBe(input.countryISO);
    expect(saved.status).toBe("pending");
    expect(typeof saved.createdAt).toBe("string");

    expect(mockRepoPE.save).not.toHaveBeenCalled();
  });

  it("debe lanzar error si se usa una región no soportada", async () => {
    const input = {
      insuredId: "00003",
      scheduleId: 44,
      countryISO: "CL" as const, // Región no soportada
    };

    await expect(useCase.execute(input)).rejects.toThrow("Unsupported region");

    expect(mockRepoPE.save).not.toHaveBeenCalled();
    expect(mockRepoCL.save).not.toHaveBeenCalled();
  });
});
