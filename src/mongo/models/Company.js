import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    companyTaxId: {
        type: String,
    },
    companyAddress: {
        type: String,
        required: true
    },
    vatRegistration: {
        type: Boolean,
        required: true
    },
    vatId: {
        type: String,
        required: false
    },
    companyCity: {
        type: String,
        required:true
    },
    country: {
        type: String,
        required: true,
        default : 'Bulgaria'
    },
    companyOwner: {
        type: String,
        required:true
    },
}, {
    timestamps: true
});


const Company = mongoose.models.Company || mongoose.model('Company', companySchema);

export default Company;
