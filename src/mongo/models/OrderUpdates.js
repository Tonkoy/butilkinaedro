import mongoose from 'mongoose';

const OrderStatusSchema = new mongoose.Schema({
    status: {
        type: Boolean,
        default: false
    },
    updated: {
        type: Date
    }
});

const OrderUpdateSchema = new mongoose.Schema({
    received: {
        ...OrderStatusSchema.obj,
        status: { type: Boolean, default: true }
    },
    inProgress: OrderStatusSchema,
    shipped: OrderStatusSchema,
    completed: OrderStatusSchema,
    cancelled: OrderStatusSchema,
}, {
    timestamps: true
});

const OrderUpdate = mongoose.models.OrderUpdate || mongoose.model('OrderUpdate', OrderUpdateSchema);

export default OrderUpdate;
