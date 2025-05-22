// src/adapters/dynamodb/AppointmentRepository.ts
import { Appointment } from "@/domain/appointment/Appointment";
import { AppointmentRepository } from "@/domain/appointment/AppointmentRepository";
import { docClient } from "@/infrastructure/dynamodbClient";
import { PutCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

export class DynamoAppointmentRepositoryPE implements AppointmentRepository {
  private tableName = process.env.APPOINTMENTS_TABLE_PE;

  async save(appointment: Appointment): Promise<void> {
    await docClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: appointment,
      })
    );
  }

  async findByInsuredId(insuredId: string): Promise<Appointment[]> {
    const result = await docClient.send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: "insuredId = :id",
        ExpressionAttributeValues: {
          ":id": insuredId,
        },
      })
    );
    return result.Items as Appointment[];
  }

  async updateStatus(insuredId: string, status: "completed"): Promise<void> {
    await docClient.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { insuredId },
        UpdateExpression: "SET #status = :status",
        ExpressionAttributeNames: { "#status": "status" },
        ExpressionAttributeValues: { ":status": status },
      })
    );
  }
}
