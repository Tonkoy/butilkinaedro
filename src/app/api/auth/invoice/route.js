import { NextResponse } from 'next/server';
import connectDB from 'src/utils/connectDB';
import Invoice from 'src/mongo/models/Invoice';
import Company from 'src/mongo/models/Company';
import Order from 'src/mongo/models/Order';

await connectDB();

// GET: /api/auth/invoice?invoiceNumber=XXX
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const invoiceNumber = searchParams.get('invoiceNumber');

        if (!invoiceNumber) {
            return NextResponse.json({ message: 'Missing invoice number' }, { status: 400 });
        }

        const invoice = await Invoice.findOne({ invoiceNumber }).populate({
            path: 'recipient',
            model: Company,
        });

        if (!invoice) {
            return NextResponse.json({ success: false, message: 'Invoice not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: invoice }, { status: 200 });
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST: /api/auth/invoice
export async function POST(req) {
    try {
        const body = await req.json();
        const { orderId } = body;


        if (!orderId) {
            return NextResponse.json({ message: 'Missing orderId' }, { status: 400 });
        }

        const order = await Order.findById(orderId);

        if (!order) {
            return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
        }

        if (!order.userId) {
            return NextResponse.json({ success: false, message: 'Cannot issue invoice for guest order' }, { status: 400 });
        }

        let recipientCompany = await Company.findOne({ userId: order.userId });

        if (!recipientCompany) {
            return NextResponse.json({ success: false, message: 'Няма фирмени данни за фактура' }, { status: 404 });
        }

        const invoiceItems = order.items.map((item) => ({
            description: item.invoiceDescription || 'Рекламни материали',
            quantity: item.quantity,
            unitPrice: item.price,
            totalPrice: item.quantity * item.price,
        }));

        const newInvoiceData = {
            orderId: order._id,
            recipient: recipientCompany._id,
            items: invoiceItems,
            subTotal: order.subTotal,
            taxPrice: order.taxPrice,
            total: order.total,
            shippingCost: 0,
            userId: order.userId || null,
            paymentType: order.paymentType,
        };

        const newInvoice = await Invoice.create(newInvoiceData);

        order.invoice = newInvoice._id;
        await order.save();

        return NextResponse.json({ success: true, data: newInvoice }, { status: 200 });
    } catch (error) {
        console.error('POST error:', error);
        return NextResponse.json({ success: false, message: 'Failed to create invoice', error: error.message }, { status: 500 });
    }
}

// PATCH: /api/auth/invoice
export async function PATCH(req) {
    try {
        const { invoiceId, status } = await req.json();

        if (!invoiceId || !status) {
            return NextResponse.json({ message: 'Invoice ID and status are required' }, { status: 400 });
        }

        const updatedInvoice = await Invoice.findByIdAndUpdate(
          invoiceId,
          { status },
          { new: true }
        );

        if (!updatedInvoice) {
            return NextResponse.json({ success: false, message: 'Invoice not found' }, { status: 404 });
        }

        if (status.toLowerCase() === 'paid') {
            const updatedInvoicePopulated = await Invoice.findById(updatedInvoice._id).populate('order');

            if (!updatedInvoicePopulated.order) {
                return NextResponse.json({ success: false, message: 'Order not found for the invoice' }, { status: 404 });
            }
            updatedInvoicePopulated.order.paymentStatus = true;
            await updatedInvoicePopulated.order.save();
        }

        return NextResponse.json({ success: true, data: updatedInvoice }, { status: 200 });
    } catch (error) {
        console.error('PATCH error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
