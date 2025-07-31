import mongoose, { set } from "mongoose";
import bcrypt from "bcrypt";


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: [3, "First Name must be at least 3 chars"],
        maxLength: 20,
        lowercase: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        minLength: [3, "Last Name must be at least 3 chars long"],
        maxLength: 20,
        lowercase: true,
        trim: true
    },
    age: {
        type: Number,
        required: true,
        min: [18, "Age should not be less than 18 years old"],
        max: [100, "Max age is 100 years"],
        index: {
            name: 'idx_age'
        }

    },
    gender: {
        type: String,
        enum: ["male", "female"],
        default: "male"
    },
    email: {
        type: String,
        required: true,
        index: {
            unique: true,
            name: 'idx_email_unique'
        }
    },
    password: {
        type: String,
        required: true,
        /*set(value) {
            const salt = bcrypt.genSaltSync(10);
            return bcrypt.hashSync(value, salt);
        }*/
    },
    otps: {
        confirmation: String,
        resetPassword: String
    },
    isConfirmed: {
        type: Boolean,
        default: false

    },
    phoneNumber: {
        type: String,
        required: true
    },
},
    {
        timestamps: true,
        toJSON: {
            virtuals: true
        },
        // to appear in logs
        toObject: {
            virtuals: true
        },
        virtuals: {
            fullName: {
                get() {
                    return `${this.firstName} ${this.lastName}`
                }
            }
        },
        methods: {
            getfullName() {
                return `${this.firstName} ${this.lastName}`
            }
        }

    })



userSchema.index({ firstName: 1, lastName: 1 }, { name: 'idx_first_last_unique', unique: true });


const User = mongoose.model("User", userSchema)

export default User