// src/domain/Appointment.ts
export interface Appointment {
  insuredId: string;
  scheduleId: number;
  countryISO: "PE" | "CL";
  status: "pending" | "completed";
  createdAt: string;
  updatedAt?: string;
}
