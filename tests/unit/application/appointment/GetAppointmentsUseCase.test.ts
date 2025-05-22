import { getAppointmentRepository } from "@/application/appointment/AppointmentRepositoryFactory";
import { GetAppointmentsUseCase } from "@/application/appointment/GetAppointmentsUseCase";
import { AppointmentRepository } from "@/domain/appointment/AppointmentRepository";

describe("GetAppointmentsUseCase", () => {
  let repo = getAppointmentRepository("CL");
  let useCase: GetAppointmentsUseCase;

  beforeEach(() => {
    useCase = new GetAppointmentsUseCase("CL");
  });

  it("debe devolver la lista de appointments de un asegurado", async () => {
    const list = await useCase.execute("00001");
    expect(repo.findByInsuredId).toHaveBeenCalledWith("00001");
    expect(list).toHaveLength(1);
    expect(list[0].countryISO).toBe("CL");
  });
});
