// src/adapters/rds/AppointmentRDSRepository.ts
import { Appointment } from "@/domain/appointment/Appointment";
import { AppointmentRepository as DomainRepo } from "@/domain/appointment/AppointmentRepository";
import { pool } from "@/infrastructure/rdsClient";

export class AppointmentRDSRepository implements DomainRepo {
  async save(appointment: Appointment): Promise<void> {
    const sql = `
      INSERT INTO appointments 
      (insured_id, schedule_id, country_iso, status, created_at)
      VALUES (?, ?, ?, ?, ?)
    `;
    const params = [
      appointment.insuredId,
      appointment.scheduleId,
      appointment.countryISO,
      appointment.status,
      appointment.createdAt,
    ];
    await pool.execute(sql, params);
  }

  // No implementamos findByInsuredId ni updateStatus aquí,
  // pues sólo usamos RDS para persistir inicialmente.
  async findByInsuredId(_: string): Promise<Appointment[]> {
    throw new Error("Not implemented");
  }
  async updateStatus(_: string, __: "completed"): Promise<void> {
    throw new Error("Not implemented");
  }
}
