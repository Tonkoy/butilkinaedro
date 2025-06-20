import { NextResponse } from 'next/server';
import connectDB from 'src/utils/connectDB';
import Address from 'src/mongo/models/Address';
import User from 'src/mongo/models/User';
import jwt from 'jsonwebtoken';

await connectDB();

export async function GET(req) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const addresses = await Address.find({ userId: decoded.userId });

    return NextResponse.json({ addresses }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

export async function POST(req) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const data = await req.json();

    // If setting new address as primary, reset others
    if (data.primary) {
      await Address.updateMany({ userId: decoded.userId }, { primary: false });
    }

    const address = await Address.create({ userId: decoded.userId, ...data });

    // Update user's defaultAddress if this is primary
    if (address.primary) {
      await User.findByIdAndUpdate(decoded.userId, { defaultAddress: address._id });
    }

    return NextResponse.json({ address }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

export async function PUT(req) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { addressId, ...data } = await req.json();

    if (data.primary) {
      await Address.updateMany({ userId: decoded.userId }, { primary: false });
    }

    const updatedAddress = await Address.findByIdAndUpdate(addressId, data, { new: true });

    if (!updatedAddress) {
      return NextResponse.json({ message: 'Address not found' }, { status: 404 });
    }

    if (updatedAddress.primary) {
      await User.findByIdAndUpdate(decoded.userId, { defaultAddress: updatedAddress._id });
    }

    return NextResponse.json({ address: updatedAddress }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

export async function DELETE(req) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { addressId } = await req.json();

    console.log(addressId)

    const deleted = await Address.findByIdAndDelete(addressId);

    if (!deleted) {
      return NextResponse.json({ message: 'Address not found' }, { status: 404 });
    }

    // Clear defaultAddress if deleted was primary
    const user = await User.findById(decoded.userId);
    if (user.defaultAddress?.toString() === addressId) {
      await User.findByIdAndUpdate(decoded.userId, { $unset: { defaultAddress: '' } });
    }

    return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
