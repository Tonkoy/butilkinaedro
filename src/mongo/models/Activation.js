import mongoose from "mongoose";

const activationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      expires: 3600, // 1 hour
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Activation = mongoose.models.Activation || mongoose.model("Activation", activationSchema);

export default Activation;
