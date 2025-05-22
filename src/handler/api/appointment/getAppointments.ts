import { APIGatewayProxyHandler } from "aws-lambda";
import { GetAppointmentsUseCase } from "@/application/appointment/GetAppointmentsUseCase";

/**
 * @openapi
 * /appointments/{insuredId}:
 *   get:
 *     summary: Obtener listado de citas médicas por código de asegurado
 *     tags:
 *       - Appointments
 *     parameters:
 *       - in: path
 *         name: insuredId
 *         required: true
 *         schema:
 *           type: string
 *         description: Código del asegurado de 5 dígitos
 *       - in: header
 *         name: x-country-iso
 *         required: true
 *         schema:
 *           type: string
 *           enum: [PE, CL]
 *         description: Código de país ISO 3166-1 alfa-2
 *     responses:
 *       200:
 *         description: Lista de citas médicas del asegurado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   appointmentId:
 *                     type: string
 *                   scheduleId:
 *                     type: number
 *                   status:
 *                     type: string
 *                     enum: [pending, completed]
 *                   centerId:
 *                     type: number
 *                   specialtyId:
 *                     type: number
 *                   medicId:
 *                     type: number
 *                   date:
 *                     type: string
 *                     format: date-time
 *       400:
 *         description: Código de asegurado o región faltante o inválido
 *       500:
 *         description: Error interno al obtener las citas
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  const insuredId = event.pathParameters?.insuredId;
  const countryISO = event.headers["x-country-iso"]?.toUpperCase();

  if (!countryISO || !["PE", "CL"].includes(countryISO)) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Invalid countryISO",
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
