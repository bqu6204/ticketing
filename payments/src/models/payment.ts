import mongoose from "mongoose";

interface IPaymentAttributes {
  orderId: string;
  stripeId: string;
}

interface IPaymentDocument extends mongoose.Document {
  orderId: string;
  stripeId: string;
}

interface IPaymentModel extends mongoose.Model<IPaymentDocument> {
  build(attributes: IPaymentAttributes): IPaymentDocument;
}

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      required: true,
      type: String,
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

paymentSchema.statics.build = (attributes: IPaymentAttributes) => {
  return new Payment(attributes);
};

const Payment = mongoose.model<IPaymentDocument, IPaymentModel>(
  "Payment",
  paymentSchema
);

export { Payment };
