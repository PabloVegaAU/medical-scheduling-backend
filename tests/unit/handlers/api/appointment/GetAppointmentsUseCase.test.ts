import * as UseCaseModule from "@/application/appointment/GetAppointmentsUseCase";
import { handler } from "@/handler/api/appointment/getAppointments";
import { APIGatewayProxyResult, Context, Callback } from "aws-lambda";

describe("getAppointments.handler", () => {
  beforeAll(() => {
    jest
      .spyOn(UseCaseModule, "GetAppointmentsUseCase")
      .mockImplementation((): any => ({
        execute: jest.fn().mockResolvedValue([
          {
            insuredId: "00001",
            scheduleId: 1,
            countryISO: "PE",
            status: "pending",
            createdAt: "",
          },
        ]),
      }));
  });

  it("responde 400 si falta insuredId", async () => {
    // event mínimo con pathParameters vacío
    const event = { pathParameters: {} } as unknown as any;
    const context = {} as Context;
    const callback = {} as Callback;

    const result = (await handler(
      event,
      context,
      callback
    )) as APIGatewayProxyResult;
    expect(result.statusCode).toBe(400);
  });

  it("responde 200 con lista", async () => {
    // event con insuredId válido
    const event = { pathParameters: { insuredId: "00001" } } as unknown as any;
    const context = {} as Context;
    const callback = {} as Callback;

    const result = (await handler(
      event,
      context,
      callback
    )) as APIGatewayProxyResult;
    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(Array.isArray(body)).toBe(true);
  });
});
