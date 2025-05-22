// src/application/CreateAppointmentUseCase.ts
import { AppointmentDTO } from "@/domain/appointment/AppointmentDTO";
import { getAppointmentRepository } from "./AppointmentRepositoryFactory";

export class CreateAppointmentUseCase {
  async execute(appointmentData: AppointmentDTO): Promise<void> {
    const region = appointmentData.countryISO; // asume que viene en el DTO
    const repository = getAppointmentRepository(region);
    await repository.save({
      ...appointmentData,
      status: "pending",
      createdAt: new Date().toISOString(),
    });
  }
}
