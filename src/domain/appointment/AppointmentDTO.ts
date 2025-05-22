// src/domain/AppointmentDTO.ts
export interface AppointmentDTO {
  insuredId: string;
  scheduleId: number;
  countryISO: "PE" | "CL";
  status?: string;
  createdAt?: string;
}
