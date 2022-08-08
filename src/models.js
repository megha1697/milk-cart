const mongoose = require('mongoose')

const milkSchema = new mongoose.Schema({
    orderId: {
        type: Number,
        required: true,
        unique: true,
        trim: true
    },
    status: {
        type: String,
        valid: ['placed', 'packed', 'dispatched', 'delivered'],
        default: 'placed'
    },
    quantity: {
        type: Number,
        required: true
    },
    deliveryLocation: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
    },
    createdAt: {
        type: Date,
        default: new Date(0)
    },
    updatedAt: {
        type: Date,
        default: new Date(0)
    }
})

const MilkCart = mongoose.model('milk_carts', milkSchema)

module.exports = MilkCart