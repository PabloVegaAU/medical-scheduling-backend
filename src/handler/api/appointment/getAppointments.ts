// src/handler/api/appointment/getAppointments.ts
import { APIGatewayProxyHandler } from "aws-lambda";
import { GetAppointmentsUseCase } from "@/application/appointment/GetAppointmentsUseCase";

export const handler: APIGatewayProxyHandler = async (event) => {
  const insuredId = event.pathParameters?.insuredId;
  const countryISO = event.queryStringParameters?.countryISO;

  if (!countryISO) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Missing required query parameter: countryISO",
      }),
    };
  }

  if (!["PE", "CL"].includes(countryISO)) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Invalid countryISO. Must be 'PE' or 'CL'",
      }),
    };
  }

  if (!insuredId) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Missing or invalid insuredId or countryISO",
      }),
    };
  }

  try {
    const useCase = new GetAppointmentsUseCase(countryISO as "PE" | "CL");
    const appointments = await useCase.execute(insuredId);

    return {
      statusCode: 200,
      body: JSON.stringify(appointments),
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch appointments" }),
    };
  }
};
