import connectDB from "src/utils/connectDB";
import Users from 'src/mongo/models/User';
import Activation from "src/mongo/models/Activation";
import {NextResponse} from "next/server";


await connectDB();

export async function POST(req) {
    await connectDB();
    try {
        const { email, code } = await req.json();
        console.log(email, code)
        if (!email || !code) {
            return new Response(JSON.stringify({ message: "Имейл и кода трябва да бъдат зададени" }), { status: 400 });
        }

        const activationRecord = await Activation.findOne({ email, code });
        if (!activationRecord) {
            return new Response(JSON.stringify({ message: "Невалиден или изтекъл код" }), { status: 400 });
        }

        // Optionally, you can limit attempts for extra security
        if (activationRecord.attempts >= 5) {
            await Activation.deleteOne({ _id: activationRecord._id });
            return new Response(JSON.stringify({ message: "Твърде много опити за активиране" }), { status: 429 });
        }

        // Activate user
        const user = await Users.findById(activationRecord.userId);
        if (!user) {
            return new Response(JSON.stringify({ message: "Несъществуващ потребител" }), { status: 404 });
        }

        user.active = true;
        await user.save();
        await Activation.deleteOne({ _id: activationRecord._id });

        return new Response(JSON.stringify({ message: "Успещно изпратен код" }), { status: 200 });
    } catch (error) {
        console.error('Activation error:', error);
        return new Response(JSON.stringify({ message: "Грешка в сървъра" }), { status: 500 });
    }
}
