import { handler } from "@/handler/api/appointment/createAppointment";
import * as UseCaseModule from "@/application/appointment/CreateAppointmentUseCase";
import { APIGatewayProxyResult, Context, Callback } from "aws-lambda";

describe("createAppointment.handler", () => {
  let mockUseCaseInstance: any;

  beforeAll(() => {
    // Mockeamos el constructor para que devuelva un objeto con execute()
    mockUseCaseInstance = { execute: jest.fn().mockResolvedValue(undefined) };
    jest
      .spyOn(UseCaseModule, "CreateAppointmentUseCase")
      .mockImplementation((): any => mockUseCaseInstance);
  });

  it("responde 400 si payload inválido", async () => {
    const event = {
      body: JSON.stringify({
        insuredId: "abc",
        scheduleId: 1,
        countryISO: "PE",
      }),
    } as unknown as any;
    const context = {} as Context;
    const callback = {} as Callback;

    const result = (await handler(
      event,
      context,
      callback
    )) as APIGatewayProxyResult;
    expect(result.statusCode).toBe(400);
  });

  it("responde 202 en caso de éxito", async () => {
    const validPayload = {
      insuredId: "00001",
      scheduleId: 1,
      countryISO: "CL",
    };
    const event = { body: JSON.stringify(validPayload) } as unknown as any;
    const context = {} as Context;
    const callback = {} as Callback;

    const result = (await handler(
      event,
      context,
      callback
    )) as APIGatewayProxyResult;
    expect(result.statusCode).toBe(202);
    const body = JSON.parse(result.body);
    expect(body.message).toMatch(/proceso/);
    // Verificamos que se haya llamado al UseCase con los datos parseados
    expect(mockUseCaseInstance.execute).toHaveBeenCalledWith(validPayload);
  });
});
