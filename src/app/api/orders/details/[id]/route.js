import connectDB from 'src/utils/connectDB';
import Order from 'src/mongo/models/Order';

// GET method to fetch a single product by ID
export async function GET(req, { params }) {
  const { id: orderId } = params; // Extract product ID from the dynamic route
  console.log(orderId)

  try {
    await connectDB(); // Connect to the database
    console.log('Database connected');

    if (!orderId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Order ID is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Fetch a single product by ID
    const product = await Order.findOne({orderId});

    if (!product) {
      return new Response(
        JSON.stringify({ success: false, error: 'Order not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: product }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error fetching product by ID:', error.message);

    return new Response(
      JSON.stringify({ success: false, error: 'Server Error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

// POST method to create a new product (with a specific ID route)
export async function POST(req) {
  try {
    await connectDB(); // Connect to the database

    const body = await req.json(); // Parse the request body

    // Create a new product from the request body
    const newOrder = new Order(body);
    await newOrder.save();

    return new Response(
      JSON.stringify({ success: true, data: newOrder }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error creating product:', error.message);

    return new Response(
      JSON.stringify({ success: false, error: 'Server Error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

// PUT method to update a product by ID
export async function PUT(req, { params }) {
  const { id: orderId } = params;

  try {
    await connectDB(); // Connect to the database

    if (!orderId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Order ID is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const body = await req.json(); // Parse the request body

    // Update the product by ID
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      body,
      { new: true, runValidators: true } // Return the updated document and validate input
    );

    if (!updatedOrder) {
      return new Response(
        JSON.stringify({ success: false, error: 'Order not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: updatedOrder }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error updating product:', error.message);

    return new Response(
      JSON.stringify({ success: false, error: 'Server Error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

// DELETE method to delete a product by ID
export async function DELETE(req, { params }) {
  const { id: orderId } = params;

  try {
    await connectDB(); // Connect to the database

    if (!orderId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Order ID is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return new Response(
        JSON.stringify({ success: false, error: 'Order not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: deletedOrder }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error deleting product:', error.message);

    return new Response(
      JSON.stringify({ success: false, error: 'Server Error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
