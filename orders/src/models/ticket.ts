// We need a ticket database specific to this server.
// So we can't just simply duplicate the Ticket model from the Ticket server.
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { Order, OrderStatus } from "./order";

interface ITicketAttributes {
  id: string;
  title: string;
  price: number;
}

interface ITicketDocument extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

interface ITicketModel extends mongoose.Model<ITicketDocument> {
  build(attributes: ITicketAttributes): ITicketDocument;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<ITicketDocument | null>;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

// ticketSchema.pre("save", function (done) {
//   // can't use arrow function
//   this.$where = {
//     version: this.get("version") - 1,
//   };

//   done();
// });

ticketSchema.statics.build = (attributes: ITicketAttributes) => {
  return new Ticket({
    _id: attributes.id,
    title: attributes.title,
    price: attributes.price,
  });
};
ticketSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

ticketSchema.methods.isReserved = async function () {
  // if we use arrow function , it will mess around the "this"
  // "this" === the ticket document that we just called 'isReserved' on
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  return !!existingOrder;
};

const Ticket = mongoose.model<ITicketDocument, ITicketModel>(
  "Ticket",
  ticketSchema
);

export { Ticket, ITicketDocument };
