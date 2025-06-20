import { NextResponse } from 'next/server';
import connectDB from 'src/utils/connectDB';
import Company from 'src/mongo/models/Company';
import User from 'src/mongo/models/User';
import jwt from 'jsonwebtoken';

await connectDB();

export async function GET(req) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const company = await Company.findOne({ userId: decoded.userId });

    return NextResponse.json({ company }, { status: 200 });
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

    // If setting new company as primary, reset others
    if (data.primary) {
      await Company.updateMany({ userId: decoded.userId }, { primary: false });
    }

    const company = await Company.create({ userId: decoded.userId, ...data });

    // Update user's defaultCompany if this is primary
    if (company.primary) {
      await User.findByIdAndUpdate(decoded.userId, { defaultCompany: company._id });
    }

    return NextResponse.json({ company }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

export async function PUT(req) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { companyId, ...data } = await req.json();

    if (data.primary) {
      await Company.updateMany({ userId: decoded.userId }, { primary: false });
    }

    const updatedCompany = await Company.findByIdAndUpdate(companyId, data, { new: true });

    if (!updatedCompany) {
      return NextResponse.json({ message: 'Company not found' }, { status: 404 });
    }

    if (updatedCompany.primary) {
      await User.findByIdAndUpdate(decoded.userId, { defaultCompany: updatedCompany._id });
    }

    return NextResponse.json({ company: updatedCompany }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

export async function DELETE(req) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { companyId } = await req.json();

    console.log(companyId)

    const deleted = await Company.findByIdAndDelete(companyId);

    if (!deleted) {
      return NextResponse.json({ message: 'Company not found' }, { status: 404 });
    }

    // Clear defaultCompany if deleted was primary
    const user = await User.findById(decoded.userId);
    if (user.defaultCompany?.toString() === companyId) {
      await User.findByIdAndUpdate(decoded.userId, { $unset: { defaultCompany: '' } });
    }

    return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
