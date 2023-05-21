import mongoose from "mongoose";
import { PasswordManager } from "../services/password-manager";

// An interface that describes the properties
// that are required to create a new User
interface IUserAttributes {
  email: string;
  password: string;
}

// An interface that describes the properties
// that a User Document has
interface IUserDocument extends mongoose.Document {
  email: string;
  password: string;
}

// An interface that describes the properties
// that a UserModel has
interface IUserModel extends mongoose.Model<IUserDocument> {
  build(attributes: IUserAttributes): IUserDocument;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String, // for mongoose, refering to javascript class "String", nothing to do with typescript
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password; // javascript keyword: delete
      },
      versionKey: false,
    },
  }
);

userSchema.pre("save", async function (done) {
  // !!! DO NOT USE ARROW FUNCTION: we need to use this as "mongoose.Document", using arrow function will make this refer to the whole user document
  if (this.isModified("password")) {
    // to prevent re-hashing password
    const hashed = await PasswordManager.toHash(this.get("password"));
    this.set("password", hashed);
  }

  done(); // has to be called when done in mongoose
});

// this build function is only for type checking before adding a new User
userSchema.statics.build = (attributes: IUserAttributes) => {
  return new User(attributes);
};

const User = mongoose.model<IUserDocument, IUserModel>("User", userSchema);

export { User };
