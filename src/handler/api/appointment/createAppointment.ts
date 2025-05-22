// src/handler/api/appointment/createAppointment.ts
import { APIGatewayProxyHandler } from "aws-lambda";
import { CreateAppointmentUseCase } from "@/application/appointment/CreateAppointmentUseCase";

const useCase = new CreateAppointmentUseCase();

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const { insuredId, scheduleId, countryISO } = body;

    if (!/^[0-9]{5}$/.test(insuredId)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid insuredId" }),
      };
    }

    if (!scheduleId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid scheduleId" }),
      };
    }

    if (!["PE", "CL"].includes(countryISO)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid countryISO" }),
      };
    }

    await useCase.execute({ insuredId, scheduleId, countryISO });

    return {
      statusCode: 202,
      body: JSON.stringify({ message: "Agendamiento en proceso" }),
    };
  } catch (e) {
    console.error(e);
    return { statusCode: 500, body: JSON.stringify({ error: "Server error" }) };
  }
};
