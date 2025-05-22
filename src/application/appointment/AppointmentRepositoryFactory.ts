import { DynamoAppointmentRepositoryCL } from "@/adapters/dynamodb/DynamoAppointmentRepositoryCL";
import { DynamoAppointmentRepositoryPE } from "@/adapters/dynamodb/DynamoAppointmentRepositoryPE";
import { AppointmentRepository } from "@/domain/appointment/AppointmentRepository";

export function getAppointmentRepository(
  countryISO: "PE" | "CL"
): AppointmentRepository {
  switch (countryISO) {
    case "PE":
      return new DynamoAppointmentRepositoryPE();
    case "CL":
      return new DynamoAppointmentRepositoryCL();
    default:
      throw new Error(`Unsupported countryISO: ${countryISO}`);
  }
}
