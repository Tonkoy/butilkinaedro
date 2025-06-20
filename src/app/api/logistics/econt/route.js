import axios from 'axios';

export async function GET(req) {
  try {
    // Make the API call to fetch Econt offices
    const response = await axios.post(
      'https://ee.econt.com/services/Nomenclatures/NomenclaturesService.getOffices.json',
      { countryCode: 'BGR' }
    );

    // Return the successful response
    return new Response(
      JSON.stringify({ success: true, data: response.data }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error fetching Econt offices:', error);

    // Return an error response
    return new Response(
      JSON.stringify({ success: false, error: 'Server Error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
