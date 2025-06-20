import bcrypt from "bcrypt";
import Users from "src/mongo/models/User";
import Activation from "src/mongo/models/Activation";
import connectDB from "src/utils/connectDB";
import sgMail from "@sendgrid/mail";
import {CONFIG} from "../../../../config-global";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function generateRandomString(length) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}

function generateSixDigitCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}



// POST method handler for registration
export async function POST(req) {
  try {
    await connectDB();

    const { firstName, lastName, email, password } = await req.json();

    // Check if the email is already registered
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({
          message: "Имейл адресът вече е регистриран. Моля, използвайте друг имейл адрес.",
        }),
        { status: 409 }
      );
    }

    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = await Users.create({
      firstName,
      lastName,
      email,
      password: hash,
    });

    // Generate activation code
    const activationCode = generateSixDigitCode();

    // Create activation record
    await Activation.create({
      userId: newUser._id,
      email,
      code: activationCode,
    });

    // Send activation email
    const msg = {
      to: email,
      from: "no-reply@boilerplate.com",
      templateId: "d-a15afe6217b04ce8a78b98b627eeea18",
      dynamic_template_data: {
        name: `${newUser.firstName} ${newUser.lastName}`,
        activationLink: `${process.env.LOCALHOST_URL}/auth/verify?email=${email}`,
        activationCode,
      },
    };

    await sgMail.send(msg);

    return new Response(
      JSON.stringify({
        message:
          `Успешна регистрация! Моля проверете e-mail адресът си за да активирате вашият акаунт.`,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Грешка в сървъра" }),
      { status: 500 }
    );
  }
}

// Fallback for unsupported methods
export const GET = async () => {
  return new Response(
    JSON.stringify({ message: "Методът не е позволен" }),
    { status: 405 }
  );
};
