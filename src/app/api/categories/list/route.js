import connectDB from 'src/utils/connectDB';
import Category from 'src/mongo/models/Category';

// GET method to fetch categories
export async function GET(req) {
  try {
    await connectDB(); // Connect to the database
    const categories = await Category.find(); // Fetch all categories
    console.log('Category fetched:', categories);

    return new Response(
      JSON.stringify({ success: true, data: categories }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error fetching Categories in API handler:', error.message);

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
    console.log(body)
    const newCategory = new Category(body);
    await newCategory.save();

    return new Response(JSON.stringify({ success: true, data: newCategory }), {
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
