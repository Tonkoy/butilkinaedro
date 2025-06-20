import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Users from "src/mongo/models/User";
import connectDB from "src/utils/connectDB";

// POST handler for the API route
export async function POST(req) {
  try {
    // Connect to the database
    const connection = await connectDB();

    if (!connection) {
      return new Response(
        JSON.stringify({ message: "Database connection failed" }),
        { status: 500 }
      );
    }

    // Parse the JSON body from the request
    const { email, password } = await req.json();

    // Find the user in the database
    const user = await Users.findOne({ email });

    if (!user) {
      return new Response(
        JSON.stringify({ message: "Не съществува потребител с такъв е-mail" }),
        { status: 401 }
      );
    }

    if (!user.active) {
      return new Response(
        JSON.stringify({ message: "Този акаунт все още не е активиран" }),
        { status: 401 }
      );
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({ message: "Грешна парола!" }),
        { status: 401 }
      );
    }

    // Generate a JWT token
    const accessToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );

    // Return the successful response
    return new Response(
      JSON.stringify({
        message: "Успешна регистрация",
        accessToken,
        user,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: "Server error", error: error.message }),
      { status: 500 }
    );
  }
}

// Fallback for unsupported HTTP methods
export const GET = async () => {
  return new Response(
    JSON.stringify({ message: "GET method is not supported for this route." }),
    { status: 405 }
  );
};
