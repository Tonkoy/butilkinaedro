import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});
const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

const invoiceItemSchema = new mongoose.Schema({
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true }
});

const invoiceSchema = new mongoose.Schema({
    invoiceNumber: { type: String, unique: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    providerDetails: {
        type: Object,
        required: true,
        default: {
            companyName: "Адкод ЕООД",
            companyId: "BG206069603",
            companyAddress: "ул. Плачковски Манастир 18, София, 1515, България",
            phone: "0876 500 515",
            bankDetails: {
                name: 'Уникредит Булбанк',
                iban: "BG17UNCR70001525507706",
                bic: 'UNCRBGSF'
            }
        }
    },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    items: [invoiceItemSchema],
    subTotal: { type: Number, required: true },
    shippingCost: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    taxPrice: { type: Number },
    total: { type: Number, required: true },
    currency: { type: String, required: true, default: 'BGN' },
    status: { type: String, required: true, default: 'pending' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    paymentType: { type: String, default: 'card' },
}, {
    timestamps: true
});

invoiceSchema.pre('save', async function(next) {
    if (this.isNew) {
        const doc = await Counter.findByIdAndUpdate({ _id: 'invoiceId' }, { $inc: { seq: 1 } }, { new: true, upsert: true });
        const seqString = doc.seq.toString().padStart(9, '0'); // Ensure the sequence has 9 digits
        this.invoiceNumber = `7${seqString}`; // Prefix with '7'
    }
    next();
});

const Invoice = mongoose.models.Invoice || mongoose.model('Invoice', invoiceSchema);

export default Invoice;
