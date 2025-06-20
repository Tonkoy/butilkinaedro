import axios from 'axios';

export async function GET(req) {
  try {
    // Extract countryId from query parameters
    const url = new URL(req.url);
    const countryId = url.searchParams.get('countryId') || 100;

    // Speedy API credentials
    const SPEEDY_API_USERNAME = '1903121';
    const SPEEDY_API_PASSWORD = '7652838645';
    const LANGUAGE = 'BG';

    // Make the API request to Speedy
    const response = await axios.post('https://api.speedy.bg/v1/location/office/', {
      userName: SPEEDY_API_USERNAME,
      password: SPEEDY_API_PASSWORD,
      language: LANGUAGE,
      countryId: parseInt(countryId, 10), // Ensure countryId is an integer
    });

    // Return the successful response
    return new Response(
      JSON.stringify({ success: true, data: response.data }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error fetching Speedy offices:', error.message);

    // Return an error response
    return new Response(
      JSON.stringify({ success: false, error: 'Server Error', message: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
