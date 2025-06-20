import mongoose from "mongoose";

const passwordResetSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    code: { type: String, required: true }, // 6-digit code
    attempts: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    expireAt: {
      type: Date,
      default: () => Date.now() + 60 * 60 * 1000,
      index: { expires: 0 } // This uses expireAt as TTL index
    }
  },
  { timestamps: true }
);

const PasswordReset =
  mongoose.models.PasswordReset || mongoose.model("PasswordReset", passwordResetSchema);

export default PasswordReset;
