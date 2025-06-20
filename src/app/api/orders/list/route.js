import connectDB from 'src/utils/connectDB';
import Order from 'src/mongo/models/Order';

// GET method to fetch products
export async function GET(req) {
  try {
    await connectDB(); // Connect to the database
    console.log('Database connected');

    const orders = await Order.find(); // Fetch all products
    console.log('Order fetched:', orders);

    return new Response(
      JSON.stringify({ success: true, data: orders }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error fetching Orders in API handler:', error.message);

    return new Response(
      JSON.stringify({ success: false, error: 'Server Error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
