const db = require('../db_controller'),
      validator = require('../validation')

module.exports = {
    getCurrencies,
    getOrders,
    updateOrder,
    addOrder,
    deleteOrder
}

async function getCurrencies(req, res) {
    const currencies = await db.getAllCurrencyNames()
    res.send(currencies)
}

async function getOrders(req, res) {
    const orders = await db.getAllOrders()
    res.send(orders)
}

async function updateOrder(req, res) {
    const {orderNumber, price, currency, cardNumber, expiration, cvv, name} = req.body,
        {valid, validationErr} = validator.forUpdate(orderNumber, price, currency, cardNumber, expiration, cvv, name)
    if (!valid) {
        res.status(404).json(validationErr).end()
        return
    }
    const orderExists = await db.orderExists(orderNumber)
    if (!orderExists) {
        res.status(404).json([validator.messages.orderNotExists]).end()
        return
    }
    const updateSuccessful = await db.updateOrder(orderNumber, price, currency, cardNumber, expiration, cvv, name)
    if (!updateSuccessful) {
        res.status(404).json([validator.messages.updateError]).end()
        return
    }
    res.status(200).end()
}

async function addOrder(req, res) {
    const {orderNumber, price, currency, cardNumber, expiration, cvv, name} = req.body,
        {valid, validationErr} = validator.forAdd(orderNumber, price, currency, cardNumber, expiration, cvv, name)
    if (!valid) {
        res.status(404).json(validationErr).end()
        return
    }
    const orderExists = await db.orderExists(orderNumber)
    if (orderExists) {
        res.status(404).json([validator.messages.orderExists]).end()
        return
    }
    const addSuccessful = await db.addOrder(orderNumber, price, currency, cardNumber, expiration, cvv, name)
    if (!addSuccessful) {
        res.status(404).json([validator.messages.addError]).end()
        return
    }
    res.status(200).end()
}

async function deleteOrder(req, res) {
    const {orderNumber} = req.body
    if (!validator.orderNumber(orderNumber)) {
        res.status(404).json([validator.messages.orderNumberInvalid]).end()
        return
    }
    const deleteSuccessful = await db.deleteOrder(orderNumber)
    if (!deleteSuccessful) {
        res.status(404).json([validator.messages.deleteError]).end()
        return
    }
    res.status(200).end()
}