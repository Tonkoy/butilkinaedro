import connectDB from "src/utils/connectDB";
import PasswordReset from "src/mongo/models/PasswordReset";
import Users from "src/mongo/models/User";
import bcrypt from "bcrypt";

export async function POST(req) {
  await connectDB();
  try {
    const { email, code, password } = await req.json();
    if (!email || !code || !password) {
      return new Response(JSON.stringify({ message: "All fields required." }), { status: 400 });
    }

    const reset = await PasswordReset.findOne({ email, code });
    if (!reset) {
      return new Response(JSON.stringify({ message: "Invalid or expired code." }), { status: 400 });
    }

    // (Optional) Lock after 5 attempts
    if (reset.attempts >= 5) {
      await PasswordReset.deleteOne({ _id: reset._id });
      return new Response(JSON.stringify({ message: "Too many attempts. Request a new code." }), { status: 429 });
    }

    // Update password
    const user = await Users.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ message: "User not found." }), { status: 404 });
    }
    user.password = await bcrypt.hash(password, 10);
    await user.save();

    // Clean up the reset code
    await PasswordReset.deleteOne({ _id: reset._id });

    return new Response(JSON.stringify({ message: "Password updated." }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}
