import connectDB from 'src/utils/connectDB';
import Callbacks from 'src/mongo/models/Callbacks';
import {getCurrentTenant, getTenantConfig} from "../../../config-tenants";
const currentTenant = getCurrentTenant();
const tenantConfig = getTenantConfig(currentTenant);
const sendGrid = require('@sendgrid/mail');
sendGrid.setApiKey(process.env.SENDGRID_API_KEY); // FIX: corrected env key typo

// POST method - Save contact + send email
export async function POST(req) {
  // const {t: tCommon } = useTranslate('common');
  try {

    await connectDB(); // Connect to DB

    const body = await req.json();
    const { name, email } = body;

    const newCallback = new Callbacks(body);
    await newCallback.save();

    const msg = {
      from: tenantConfig.mailSender,
      to: email,
      templateId: tenantConfig.mailTemplates.contactForm,
      bcc: ['orders@butilkinaedro.com'],
      dynamic_template_data: { name },
    };

    try {
      await sendGrid.send(msg);
      return new Response(JSON.stringify({ success: true, message: 'errors.emailSent' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (emailError) {
      console.error('SendGrid Error:', emailError);
      return new Response(JSON.stringify({ success: false, error: 'errors.emailServerError' }), {
        status: 203,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (err) {
    console.error('Contact POST Error:', err.message);
    return new Response(JSON.stringify({ success: false, error: 'errors.serverError' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
