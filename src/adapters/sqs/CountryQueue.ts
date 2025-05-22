// src/adapters/sqs/CountryQueue.ts
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { Appointment } from "@/domain/appointment/Appointment";

export class CountryQueue {
  private client: SQSClient;
  private queueUrls: Record<"PE" | "CL", string>;

  constructor(queueUrlPE: string, queueUrlCL: string) {
    this.client = new SQSClient({});
    this.queueUrls = { PE: queueUrlPE, CL: queueUrlCL };
  }

  async sendToQueue(appointment: Appointment): Promise<void> {
    const url = this.queueUrls[appointment.countryISO];
    if (!url)
      throw new Error(
        `No SQS URL defined for country ${appointment.countryISO}`
      );

    const command = new SendMessageCommand({
      QueueUrl: url,
      MessageBody: JSON.stringify(appointment),
      MessageAttributes: {
        countryISO: {
          DataType: "String",
          StringValue: appointment.countryISO,
        },
      },
    });
    await this.client.send(command);
  }
}
