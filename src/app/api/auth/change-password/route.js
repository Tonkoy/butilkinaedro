import { NextResponse } from 'next/server';
import connectDB from 'src/utils/connectDB';
import User from 'src/mongo/models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

await connectDB();

export async function POST(req) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { oldPassword, newPassword } = await req.json();

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ message: 'Не намерихме такъв потребител' }, { status: 404 });
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      return NextResponse.json({ message: 'Паролата не съвпада с настоящата' }, { status: 401 });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(decoded.userId, { password: hashedNewPassword });

    return NextResponse.json({ message: 'Паролата е обновена успешно' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Грешка в сървъра' }, { status: 500 });
  }
}
