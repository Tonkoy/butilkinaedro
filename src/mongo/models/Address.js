import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        name: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        addressType: {
            type: String,
            enum: ['Address', 'Office'],
            default: 'Address'
        },
        addressName: {
          type: String
        },
        officeName: {
            type: String
        },
        primary: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true
    }
);

const Address =
    mongoose.models.Address || mongoose.model("Address", addressSchema);

export default Address;
