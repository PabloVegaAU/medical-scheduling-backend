// src/handler/api/appointment/createAppointment.ts
import { APIGatewayProxyHandler } from "aws-lambda";
import { CreateAppointmentUseCase } from "@/application/appointment/CreateAppointmentUseCase";
import { Appointment } from "@/domain/appointment/Appointment";

const useCase = new CreateAppointmentUseCase();

/**
 * @openapi
 * /appointments:
 *   post:
 *     summary: Crear una nueva cita médica
 *     tags:
 *       - Appointments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - insuredId
 *               - scheduleId
 *               - countryISO
 *             properties:
 *               insuredId:
 *                 type: string
 *                 description: Código del asegurado
 *               scheduleId:
 *                 type: string
 *                 description: ID del espacio de cita
 *               countryISO:
 *                 type: string
 *                 enum: [PE, CL]
 *                 description: Código de país
 *     responses:
 *       200:
 *         description: Cita creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 appointmentId:
 *                   type: string
 *                 status:
 *                   type: string
 *                   enum: [pending, completed]
 *                   description: Estado de la cita
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error del servidor
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const { insuredId, scheduleId, countryISO } = body;

    if (
      !/^[0-9]{5}$/.test(insuredId) ||
      !scheduleId ||
      !["PE", "CL"].includes(countryISO)
    ) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid input" }),
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
