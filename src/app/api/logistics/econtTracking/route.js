import axios from 'axios';

export async function POST(req) {
  try {
    const payload = await req.json();

    console.log(payload)

    const response = await axios.post(
      'https://ee.econt.com/services/Shipments/LabelService.createLabel.json',
      payload,
      {
        auth: {
          username: 'info@brandbeam.bg',
          password: 'Laserengraving!1'
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    return new Response(JSON.stringify({ success: true, data: response.data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Econt API error:', error?.response?.data.innerErrors[0].innerErrors[0]);

    return new Response(JSON.stringify({ success: false, error: error?.response?.data.innerErrors[0].innerErrors[0] }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
