import connectDB from 'src/utils/connectDB';
import Product from 'src/mongo/models/Product';

// GET method to fetch products
export async function GET(req) {
  try {
    await connectDB(); // Connect to the database
    console.log('Database connected');

    const products = await Product.find({active: true}); // Fetch all products
    console.log('Products fetched:', products);

    return new Response(
      JSON.stringify({ success: true, data: products }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error fetching products in API handler:', error.message);

    return new Response(
      JSON.stringify({ success: false, error: 'Server Error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

// POST method to create a new product
export async function POST(req) {
  try {
    await connectDB(); // Connect to the database

    const body = await req.json(); // Parse JSON body
    const newProduct = new Product(body);
    await newProduct.save();

    return new Response(JSON.stringify({ success: true, data: newProduct }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return new Response(JSON.stringify({ success: false, error: 'Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
