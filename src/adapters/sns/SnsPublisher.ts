// src/adapters/sns/SnsPublisher.ts
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { Appointment } from "@/domain/appointment/Appointment";

export class SnsPublisher {
  private snsClient: SNSClient;
  private topics: Record<"PE" | "CL", string>;

  constructor(topicPE: string, topicCL: string) {
    this.snsClient = new SNSClient({});
    this.topics = { PE: topicPE, CL: topicCL };
  }

  async publish(appointment: Appointment): Promise<void> {
    const topicArn = this.topics[appointment.countryISO];
    if (!topicArn)
      throw new Error(
        "Topic ARN no definido para país " + appointment.countryISO
      );

    const message = JSON.stringify(appointment);

    const command = new PublishCommand({
      TopicArn: topicArn,
      Message: message,
      MessageAttributes: {
        countryISO: {
          DataType: "String",
          StringValue: appointment.countryISO,
        },
      },
    });

    await this.snsClient.send(command);
  }
}
