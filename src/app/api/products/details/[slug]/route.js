import connectDB from 'src/utils/connectDB';
import Product from 'src/mongo/models/Product';
import {NextResponse} from "next/server";

// GET method to fetch a single product by ID
export async function GET(req, { params }) {
  const { slug } = params; // Extract product ID from the dynamic route

  try {
    await connectDB(); // Connect to the database
    console.log('Database connected');

    if (!slug) {
      return new Response(
        JSON.stringify({ success: false, error: 'Product slug is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Fetch a single product by ID
    const product = await Product.findOne({slug});

    if (!product) {
      return new Response(
        JSON.stringify({ success: false, error: 'Product not found' }),
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

    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    await connectDB(); // Connect to the database

    const body = await req.json(); // Parse the request body

    // Create a new product from the request body
    const newProduct = new Product(body);
    await newProduct.save();

    return new Response(
      JSON.stringify({ success: true, data: newProduct }),
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
  const { id: productId } = params;

  try {
    await connectDB(); // Connect to the database
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    if (!productId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Product ID is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const body = await req.json(); // Parse the request body

    // Update the product by ID
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      body,
      { new: true, runValidators: true } // Return the updated document and validate input
    );

    if (!updatedProduct) {
      return new Response(
        JSON.stringify({ success: false, error: 'Product not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: updatedProduct }),
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
  const { id: productId } = params;

  try {
    await connectDB(); // Connect to the database

    if (!productId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Product ID is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return new Response(
        JSON.stringify({ success: false, error: 'Product not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: deletedProduct }),
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
