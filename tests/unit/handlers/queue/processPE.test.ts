import { handler } from "@/handler/queue/processPE";
import { AppointmentRDSRepository } from "@/adapters/rds/AppointmentRDSRepository";
import { ConfirmationPublisher } from "@/adapters/eventbridge/ConfirmationPublisher";
import { Context, Callback, SQSEvent } from "aws-lambda";

jest.mock("@/adapters/rds/AppointmentRDSRepository");
jest.mock("@/adapters/eventbridge/ConfirmationPublisher");

describe("processPE.handler", () => {
  it("guarda en RDS y publica confirmación", async () => {
    const fakeEvent: SQSEvent = {
      Records: [
        {
          body: JSON.stringify({
            insuredId: "00001",
            scheduleId: 1,
            countryISO: "PE",
            status: "pending",
            createdAt: "",
          }),
        } as any,
      ],
    };

    const context = {} as Context;
    const callback = {} as Callback;

    await handler(fakeEvent, context, callback);

    const repoInstance = (AppointmentRDSRepository as jest.Mock).mock
      .instances[0];
    const pubInstance = (ConfirmationPublisher as jest.Mock).mock.instances[0];

    expect(repoInstance.save).toHaveBeenCalled();
    expect(pubInstance.publishConfirmation).toHaveBeenCalled();
  });
});
