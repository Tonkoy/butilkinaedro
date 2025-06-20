import connectDB from "src/utils/connectDB";
import PasswordReset from "src/mongo/models/PasswordReset";
import Users from "src/mongo/models/User";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function generateSixDigitCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req) {
  await connectDB();
  try {
    const { email } = await req.json();
    if (!email) {
      return new Response(JSON.stringify({ message: "Email is required." }), { status: 400 });
    }

    const user = await Users.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ message: "If this email exists, a code was sent." }), { status: 200 });
    }

    // Remove previous codes
    await PasswordReset.deleteMany({ email });

    // Generate new code
    const code = generateSixDigitCode();
    await PasswordReset.create({ email, code });

    // Send email
    const msg = {
      to: email,
      from: "no-reply@brandirano.com",
      templateId: "d-16244e0657074f47bcebe1193bc5b685", // update for code
      dynamic_template_data: {
        name: user.name,
        resetCode: code,
      },
    };
    await sgMail.send(msg);

    return new Response(JSON.stringify({ message: "If this email exists, a code was sent." }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}
