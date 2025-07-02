import connectDB from 'src/utils/connectDB';
import OrderUpdates from 'src/mongo/models/OrderUpdates';
import Order from 'src/mongo/models/Order';
import User from 'src/mongo/models/User';
import sgMail from "@sendgrid/mail";
import {getCurrentTenant, getTenantConfig} from "../../../../config-tenants";
const currentTenant = getCurrentTenant();
const tenantConfig = getTenantConfig(currentTenant);
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// GET method to fetch orders
export async function GET(req) {
  try {
    await connectDB(); // Ensure database connection
    const orders = await Order.find().populate('userId').populate('items.itemId');
    return new Response(
      JSON.stringify({ success: true, data: orders }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// POST method to create a new order
export async function POST(req) {
  try {
    await connectDB(); // Ensure database connection
    const body = await req.json();

    const newOrderUpdates = await OrderUpdates.create({
      received: { status: true, updated: new Date() },
    });

    const newOrderData = {
      ...body,
      statusUpdates: newOrderUpdates._id,
      userId: body.userId || null, // Explicitly null for guests
    };

    const newOrder = await Order.create(newOrderData);
    if (body.userId) {
      await User.findByIdAndUpdate(
        body.userId,
        { $push: { orders: newOrder._id } },
        { new: true }
      );
    }

    try {
      const msg = {
        to: "info@butilkinaedro.com",
        from: tenantConfig.mailSender,
        templateId: tenantConfig.mailTemplates.createOrder,
        dynamic_template_data: {
          orderId: newOrder?.orderId || newOrder?._id,
          orderLink: `https://butilkinaedro.com/dashboard/orders/${newOrder._id}`
        }
      };

      try {
        console.log("Sending email with data:", msg);
        const sgRes = await sgMail.send(msg);
        console.log("SendGrid response:", sgRes[0].statusCode, sgRes[0].headers);
      } catch (e) {
        console.error("SendGrid error:", e.response?.body || e.message);
      }
    } catch (e) {
      console.error("SendGrid error:", e.message);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Order created successfully',
        data: newOrder,
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating order:', error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// PUT method to update an order
export async function PUT(req) {
  try {
    await connectDB(); // Ensure database connection
    const body = await req.json();
    const { orderId, updateData } = body;

    if (!orderId) {
      return new Response(
        JSON.stringify({ success: false, message: 'Order ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, { new: true });
    if (!updatedOrder) {
      return new Response(
        JSON.stringify({ success: false, message: 'Order not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: updatedOrder, message: 'Order updated successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error updating order:', error.message);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
