// src/eventbrigde/ConfirmationPublisher.ts
import {
  EventBridgeClient,
  PutEventsCommand,
} from "@aws-sdk/client-eventbridge";
import { Appointment } from "@/domain/appointment/Appointment";

export class ConfirmationPublisher {
  private client: EventBridgeClient;
  private eventBusName: string;

  constructor(eventBusName: string) {
    this.client = new EventBridgeClient({});
    this.eventBusName = eventBusName;
  }

  async publishConfirmation(appointment: Appointment): Promise<void> {
    const detail = JSON.stringify(appointment);
    const command = new PutEventsCommand({
      Entries: [
        {
          EventBusName: this.eventBusName,
          Source: "medical-scheduling-backend.appointment",
          DetailType: "AppointmentConfirmed",
          Detail: detail,
        },
      ],
    });
    await this.client.send(command);
  }
}
