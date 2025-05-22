// src/domain/AppointmentRepository.ts
import { Appointment } from "./Appointment";
import { AppointmentDTO } from "./AppointmentDTO";

export interface AppointmentRepository {
  save(appointment: AppointmentDTO): Promise<void>;
  findByInsuredId(insuredId: string): Promise<Appointment[]>;
  updateStatus(insuredId: string, status: "completed"): Promise<void>;
}
