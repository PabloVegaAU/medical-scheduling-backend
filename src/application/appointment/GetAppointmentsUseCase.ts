// src/application/appointment/GetAppointmentsUseCase.ts:
import { AppointmentRepository } from "@/domain/appointment/AppointmentRepository";
import { getAppointmentRepository } from "./AppointmentRepositoryFactory";

export class GetAppointmentsUseCase {
  private repo: AppointmentRepository;

  constructor(countryISO: "PE" | "CL") {
    this.repo = getAppointmentRepository(countryISO);
  }

  async execute(insuredId: string) {
    return await this.repo.findByInsuredId(insuredId);
  }
}
