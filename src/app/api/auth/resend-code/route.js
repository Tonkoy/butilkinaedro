import connectDB from "src/utils/connectDB";
import Users from "src/mongo/models/User";
import Activation from "src/mongo/models/Activation";
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
      return new Response(JSON.stringify({ message: "Задължителен имейл" }), { status: 400 });
    }

    // Find user (but always return generic message)
    const user = await Users.findOne({ email });
    if (!user || user.active) {
      // Log internally, but do NOT leak info to client
      return new Response(JSON.stringify({ message: "Ако имейлът съществува и не е активиран, нов код ще бъде изпратен." }), { status: 200 });
    }

    // Remove previous activation codes
    await Activation.deleteMany({ email });

    // Create new code
    const code = generateSixDigitCode();
    await Activation.create({
      userId: user._id,
      email,
      code,
    });

    // Send new code by email
    const msg = {
      to: email,
      from: tenantConfig.mailSender,
      templateId: tenantConfig.mailTemplates.sendCode,
      dynamic_template_data: {
        name: `${user.firstName} ${user.lastName}`,
        activationLink: `${process.env.LOCALHOST_URL}/auth/verify?email=${email}`,
        code,
      },
    };
    await sgMail.send(msg);

    return new Response(JSON.stringify({ message: "Ако имейлът съществува и не е активиран, нов код ще бъде изпратен." }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Възникна грешка." }), { status: 500 });
  }
}
