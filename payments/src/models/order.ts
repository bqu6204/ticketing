import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderStatus } from "@estest/common";

interface IOrderAttributes {
  id: string;
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}

interface IOrderDocument extends mongoose.Document {
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}

interface IOrderModel extends mongoose.Model<IOrderDocument> {
  build(attributes: IOrderAttributes): IOrderDocument;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
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

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attributes: IOrderAttributes) => {
  return new Order({
    _id: attributes.id,
    version: attributes.version,
    price: attributes.price,
    userId: attributes.userId,
    status: attributes.status,
  });
};

const Order = mongoose.model<IOrderDocument, IOrderModel>("Order", orderSchema);

export { Order };
