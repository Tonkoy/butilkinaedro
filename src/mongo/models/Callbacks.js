import mongoose from "mongoose";

const callbackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: String,
      required: true
    },
    subject: {
      type: String,
      required: true
    },
    status: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

let Dataset =
  mongoose.models.callbacks || mongoose.model("callbacks", callbackSchema);
export default Dataset;
