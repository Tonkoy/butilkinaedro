import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        displayName: {
            type: String,
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        phoneNumber: {
            type: String,
        },
        password: {
            type: String,
            required: true
        },
        city: {
            type: String
        },
        address: {
            type: String
        },
        state: {
            type: String
        },
        zipCode: {
            type: String,
            default: '1000'
        },
        country: {
            type: String
        },
        isPublic: {
            type: Boolean,
            default: false
        },
        role: {
            type: String,
            default: "user"
        },
        root: {
            type: Boolean,
            default: false
        },
        orders: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: "Orders"
                }
            ]
        },
        active: {
            type: Boolean,
            default: false
        },
        defaultAddress: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Address"
        },
        companyData: {
            type:Boolean,
            default: false
        },
        discount: {
          type: Number,
          default: 0
        }
    },
    {
        timestamps: true
    }
);

let User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
