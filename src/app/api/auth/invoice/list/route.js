import { NextResponse } from 'next/server';
import connectDB from 'src/utils/connectDB';
import Invoice from 'src/mongo/models/Invoice';
import Company from 'src/mongo/models/Company';
import Order from 'src/mongo/models/Order';

await connectDB();

// GET /api/user/invoice/list?userId=...
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        const invoices = await fetchInvoices(userId);

        return NextResponse.json({ success: true, data: invoices }, { status: 200 });
    } catch (error) {
        console.error('[INVOICE LIST ERROR]', error);
        return NextResponse.json(
          { success: false, message: `Server error: ${error.message}` },
          { status: 500 }
        );
    }
}

// Helper: fetch invoices (admin or user-specific)
async function fetchInvoices(userId) {
    const sort = { createdAt: -1 };

    if (userId) {
        console.log(`Fetching invoices for userId: ${userId}`);
        return await Invoice.find({ userId })
          .populate({ path: 'recipient', model: Company })
          .populate({ path: 'order', model: Order })
          .sort(sort)
          .lean()
          .then(invoices => invoices.map(inv => ({ ...inv, id: inv._id.toString() })));
    } else {
        console.log('Fetching all invoices (admin)');
        return await Invoice.find()
          .populate({ path: 'recipient', model: Company })
          .sort(sort);
    }
}
