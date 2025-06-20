import axios from 'axios';

export default async function handler(req, res) {
  const { method } = req;

  if (method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const apiUrl = 'https://clientsws.gorfactory.es:2096/api/v1.1/item/getcatalog';
  const queryParams = {
    lang: 'en-EN',
    brand: 'stamina',
    category: 'eating_drinkware',
  };

  try {
    // Fetch the bearer token from environment variables
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik9CQWp1TkdMVFJlVzVvajk0elR5Z2ZPQVNjZ2NNcktWdFFFVm9iTmtUamU4Y2NEbkJIaHpaYzhybSt0ZXVxeVdnSkR0Tk1WNzNtdzNnbGtHSzNCc1lmUTRCTlpCcXM5T2ttVkpXek9OemhzeEJhaDMzVHVzZUtyQndmOE9NWGJnWjh4NHhkL1ZUajVVQUJ6NVh3WlVlSUFIcE5LZDBzS0ZVSjd1cUFhREYrbz0iLCJjbGllbnRJZCI6ImRhYXBWbHN5aTczd1FsT2RpZDBjS2FQWDJPc1dsbXo2UDY0cmx6dE1OUVA3NDlmaGs4NXJ2TDRWMDBGYk1PeGtSalhUc0VBNUlWMGZ3d1lmbC90Wi8zWXJPMnZHRzdrRmJwSkhoUVFJeXVtOUxxZmFyanJ3V2dUSUhtNDhkWUtldGhXVG0wNmExVmptTTRjcUhWWHk2d2xpK21sSzh1VCt4T29rTVJHR3ZyST0iLCJ1c2VyTG9naW4iOiJCWlhMeEp1UE1OU3Q1RzJwdFVWM1MwaTYyWFdiT2gybHZ2WWg4MVFuelR5QWZLRitKNGJCU0xBOGp5bHhBVlRGZW1VRk9TRSszeEpPSGNJL0pxOHo1eXdNT29NYVMxejVTL1M5czlpUHRTeDRNL3ZCWWVOVHk1QXEzSjIvM0J6TjYvYWVUL3ZwR016OHk4V0tBZ01zdU5VR1NFVVZ2M3JkS21FUWdBUWFZWUU9IiwicGFzc3dvcmQiOiJ3WjNjUXE0WVBRL2duWU5NUVJIbW5RNmJlTWVHa0p6djB3YUNWZ2Yvd3hWdW9SSnJlVElSdDl4NjAxb1NRUEFiTm9NQ09uc083REFnTEhpU1ptL3dvd1lKb0ErUU9QQ2t1aGJqeWp0eUxrbkw2QVdRQjZDQU1KemIxcVVsTXNUNSttVEN3aG5YR3NUSVMvV1JCZ3I2bHFWSzEzdk5PMS84dWhNQmZxNXpKUnM9IiwiY29tcGFueSI6Im1rZHkxZ25uTGpXbUc2VTI5eVFlY2huWWlMc0lrSzBROHpFZnUvZWhTSFMxK20zR2ZiZ2llZnJUeTcrbGxjOXFmc3JOS1UxTHpUeVdOQWhIRnRTdkZkejB6VFNsc3NLY3pla0JlYW4reEU1amNoWitLSHM1bjE5OGlqY28xRGpBYXBGQWt0Ty9HYitTeFJLWFRCYzIxK0ZIREp1Z0I0bFRxdUZGeW5yOVBtWT0iLCJHVUlEIjoiYjdhYjY0Y2EtMWIxYy00MTA4LTkzNDQtODUwZDQ0NjI3ZDdlIiwiZXhwIjoxNzMxODgwOTQyLCJpc3MiOiIkM0NSRVRfSzNZX0cwUkY0Q1QwUlkjI18kM0NSRVRfSzNZX0cwUkY0Q1QwUlkjIyIsImF1ZCI6ImdvcmZhY3RvcnkifQ.5_dxESLRr0SPAQ_xVRUaMAK0RpAesWVjApuYXZizwe8";

    if (!token) {
      return res.status(500).json({ message: 'API token not configured' });
    }

    // Make the API request with the token
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: queryParams,
    });

    // Send the response back to the client
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching catalog:', error.message);

    // Handle errors and return an appropriate response
    res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Failed to fetch catalog',
    });
  }
}
