// models/User.ts
import mongoose, { Document, Model } from "mongoose";
import { boolean } from "zod";

export interface IUser extends Document {
  fullname: string;
  emailaddress: string;
  password: string;
  isadmin: boolean;
}

const userSchema = new mongoose.Schema<IUser>({
  fullname: {
    required: true,
    type: String,
  },
  emailaddress: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  isadmin: {
    required: true,
    type: Boolean,
    default: false,
  },
});

userSchema.index({ emailaddress: 1 });

let User: Model<IUser>;

try {
  User = mongoose.model<IUser>("User");
} catch {
  User = mongoose.model<IUser>("User", userSchema);
}

export { User };

// export interface IOrder extends Document {
//   packageId: string;
//   status: number;
//   userid: IUser["_id"]; // Reference to User document
// }

export interface IOrder extends Document {
  id: string;
  packid: string;
  packstatus: number;
  packtitle: string;
  packprice: string;
  packemail: string;
  packtxid: string;
  packaddr: string;
  userid: IUser["_id"];
}
enum Status {
  "Queued",
  "Processing",
  "Declined",
  "Delivered",
}

const orderSchema = new mongoose.Schema<IOrder>({
  packid: {
    required: true,
    type: String,
  },
  packtitle: {
    required: true,
    type: String,
  },
  packemail: {
    required: true,
    type: String,
  },

  packprice: {
    required: true,
    type: String,
  },
  packstatus: {
    required: true,
    type: Number,
  },
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
  },
});

let Order: Model<IOrder>;

try {
  Order = mongoose.model<IOrder>("Order");
} catch {
  Order = mongoose.model<IOrder>("Order", orderSchema);
}

export { Order };
