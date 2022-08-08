const express = require('express')
const milkCartRoutes = new express.Router()
const MilkCart = require('./models')

const maxCapacity = 100 // liters


const getLatestOrderId = async () => {
    const orders = await MilkCart.find({}).sort({ orderId: -1 });
    const capacity = orders.reduce((res, item) => res + item.quantity, 0)
    return { orderId: orders[0]?.orderId || 0, capacity }
}

milkCartRoutes.post('/add', async (req, res, next) => {
    try {
        console.log('adding record')
        const { orderId, capacity } = await getLatestOrderId();
        if ((req.body.quantity + capacity) > maxCapacity) {
            const left = maxCapacity - capacity
            return res.status(400).send(`Max capacity reached enter quantity within ${left}`);
        }
        const order = new MilkCart({
            ...req.body,
            orderId: orderId + 1
        })
        try {
            const resp = await order.save()
            return res.status(200).send(`Order added Successfully with orderId - ${resp.orderId} `);
        } catch (e) {
            res.status(400).send(e);
        }
    } catch (e) {
        res.status(400).send(e);
    }
})

milkCartRoutes.patch('/update/:id', async (req, res, next) => {
    try {
        const updates = Object.keys(req.body)
        const allowedUpdates = ['quantity', 'deliveryLocation']
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
        if (!isValidOperation) {
            return res.status(400).send({ error: 'Invalid updates!' })
        }
        const { orderId, capacity } = await getLatestOrderId();
        if ((req.body.quantity + capacity) > maxCapacity) {
            const left = maxCapacity - capacity
            return res.status(400).send(`Max capacity reached enter quantity within ${left}`)
        }

        const cart = await MilkCart.findOne({ orderId: Number(req.params.id) })
        if (!cart) {
            return res.status(404).send('Order not found')
        }

        updates.forEach((update) => cart[update] = req.body[update])
        await cart.save()
        return res.send('Order updated Successfully')
    } catch (e) {
        res.status(400).send(e)
    }
})

milkCartRoutes.patch('/updateStatus/:id', async (req, res, next) => {
    try {
        const updates = Object.keys(req.body)
        const allowedUpdates = ['status']
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

        if (!isValidOperation) {
            return res.status(400).send({ error: 'Invalid updates!' })
        }
        const validStatus = ['placed', 'packed', 'dispatched', 'delivered']
        if (!validStatus.includes(req.body.status)) {
            return res.status(404).send(`Invalid Status, should be one of ${validStatus}`)
        }
        const cart = await MilkCart.findOne({ orderId: Number(req.params.id) })
        if (!cart) {
            return res.status(404).send('Order not found')
        }

        updates.forEach((update) => cart[update] = req.body[update])
        await cart.save()
        res.send('Order status updated Successfully')
    } catch (e) {
        res.status(400).send(e)
    }
})

milkCartRoutes.delete('/delete/:id', async (req, res, next) => {
    try {
        const cart = await MilkCart.findOneAndDelete({ orderId: Number(req.params.id) })
        if (!cart) {
            res.status(404).send('Order Not found')
        }
        res.send(cart)
    } catch (e) {
        res.status(500).send()
    }
})

milkCartRoutes.get('/checkCapacity', async (req, res, next) => {
    try {
        const orders = await MilkCart.find({ createdAt: new Date(0) });
        const totalCapacity = orders.reduce((res, item) => res + item.quantity, 0)
        const left = maxCapacity - totalCapacity
        return res.status(200).send(`Total capacity for today is ${left} liters`)
    } catch (e) {
        res.status(500).send(e)
    }
})

milkCartRoutes.get('/', async (req, res, next) => {
    try {
        const orders = await MilkCart.find({});
        return res.status(200).send(orders)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = milkCartRoutes

