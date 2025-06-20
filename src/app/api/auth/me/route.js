import jwt from "jsonwebtoken";
import User from "src/mongo/models/User";
import connectDB from "src/utils/connectDB";

// Named export for the GET method
export async function GET(req) {
  // Extract the authorization header
  const authorization = req.headers.get("authorization");
  const token = authorization?.split(" ")[1];

  if (!token) {
    return new Response(JSON.stringify({ error: "Token not provided" }), {
      status: 401,
    });
  }

  try {
    // Connect to the database
    await connectDB();

    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user in the database
    const user = await User.findOne({ _id: decoded.userId }).select("-password");

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    // Return the user data (without the password field)
    return new Response(JSON.stringify({ user }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Token verification failed" }), {
      status: 401,
    });
  }
}

export async function PUT(req) {
  const authorization = req.headers.get("authorization");
  const token = authorization?.split(" ")[1];

  if (!token) {
    return new Response(JSON.stringify({ error: "Token not provided" }), {
      status: 401,
    });
  }

  try {
    await connectDB();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const body = await req.json();
    const { firstName, lastName, email, phoneNumber } = body;

    const updatedUser = await User.findOneAndUpdate(
      { _id: decoded.userId },
      { firstName, lastName, email, phoneNumber },
      { new: true, runValidators: true, select: "-password" }
    );

    if (!updatedUser) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ user: updatedUser }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to update user data" }), {
      status: 400,
    });
  }
}
