// src/handler/queue/processPE.ts
import { SQSEvent, Context, Callback } from 'aws-lambda';
import { Appointment } from '@/domain/appointment/Appointment';
import { AppointmentRDSRepository } from '@/adapters/rds/AppointmentRDSRepository';
import { ConfirmationPublisher } from '@/adapters/eventbridge/ConfirmationPublisher';

const repo = new AppointmentRDSRepository();
const publisher = new ConfirmationPublisher(process.env.EVENT_BUS_NAME!);

export const handler = async (event: SQSEvent, _ctx: Context, _cb: Callback) => {
  for (const record of event.Records) {
    const appointment: Appointment = JSON.parse(record.body);
    await repo.save(appointment);
    await publisher.publishConfirmation({ ...appointment, status: 'completed', updatedAt: new Date().toISOString() });
  }
};

