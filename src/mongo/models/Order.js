import mongoose from 'mongoose';
import { customAlphabet } from 'nanoid';
import { CONFIG } from "../../config-global";
const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 8); // Customize the character set

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    orderId: {
        type: String,
        required: true,
        default: function () {
            return `${CONFIG.orders.orderID}-${nanoid()}`;
        }
    },
    recipient: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    deliverMethod: {
        type: String, // Assuming this is a string, adjust as needed
        required: false // If this is optional, set required to false
    },
    fullAddress: {
        type: String,
        required: true
    },
    items: [{
        id: {
            type: String,
            required: true
        },
        name: {
            type: String,
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        discount: {
            type: Number
        },
        colors: [{
            type: String
        }],
        width:{
            type: Number,
        },
        height:{
            type:Number,
        },
        coverUrl: {
            required:true,
            type: String,
        },
        size:{
            type: String,
        },
        invoiceDescription: {
            type: String,
        },
        cutting: {
            type: Boolean
        }
    }],
    subTotal: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    taxPrice: {
        type: Number
    },
    totalItems: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: Boolean,
        required: true,
        default : false
    },
    paymentType: {
        type: String,
        required: true
    },
    invoice: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Invoice'
    },
    invoiceRequested: {
        type: Boolean,
        default: false
    },
    orderStatus : {
        type: String,
        required: true,
        default: "received"
    },

    statusUpdates: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderUpdates',
    },
    tracking: {
        trackingNumber:{
            type: String,
        },
        trackingUrl: {
            type: String,
        },
        shippingOffice: {
            id: {
                type: String,
            },
            code: {
                type: String,
            },
            name: {
                type: String,
            },
        },
        shippingCompany:{
            type: 'String',
        },
        shippingStatus: {
            type: Boolean,
            default :false
        }
    },
    comment: {
      type: String,
    },
}, {
    timestamps: true
});


const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;
