import connectDB from 'src/utils/connectDB';
import Callbacks from 'src/mongo/models/Callbacks';

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
      from: 'info@butilko.com',
      to: email,
      templateId: 'd-2983f3d43b9a4827a0779187163e1197',
      bcc: ['orders@butilko.com'],
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
