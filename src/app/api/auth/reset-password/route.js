import connectDB from "src/utils/connectDB";
import PasswordReset from "src/mongo/models/PasswordReset";
import Users from "src/mongo/models/User";
import sgMail from "@sendgrid/mail";
import {getCurrentTenant, getTenantConfig} from "../../../../config-tenants";
const currentTenant = getCurrentTenant();
const tenantConfig = getTenantConfig(currentTenant);
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
    // Security: always return 200
    if (!user) {
      return new Response(JSON.stringify({ message: "If this email exists, a code was sent." }), { status: 200 });
    }

    // Remove previous codes for this email
    await PasswordReset.deleteMany({ email });

    // Generate & store code
    const code = generateSixDigitCode();
    await PasswordReset.create({ email, code });

    // Send email
    const msg = {
      to: email,
      from: tenantConfig.mailSender,
      templateId: tenantConfig.mailTemplates.resetPassword, // update for code
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
