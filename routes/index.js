module.exports = (app, db, validator) => {
    
    app.get('/currencies', async (req, res) => {
        const currencies = await db.getAllCurrencyNames()
        res.send(currencies)
    })
    
    app.get('/orders', async (req, res) => {
        const orders = await db.getAllOrders()
        res.send(orders)
    })

    app.post('/updateorder', async (req, res) => {
        const {orderNumber, price, currency, cardNumber, expiration, cvv} = req.body,
              {valid, validationErr} = validator.forUpdate(orderNumber, price, currency, cardNumber, expiration, cvv)
        if (!valid) {
            res.status(404).json(validationErr).end()
            return
        }
        const orderExists = await db.orderExists(orderNumber)
        if (!orderExists) {
            res.status(404).json([validator.messages.orderNotExists]).end()
            return
        }
        const updateSuccessful = await db.updateOrder(orderNumber, price, currency, cardNumber, expiration, cvv)
        if (!updateSuccessful) {
            res.status(404).json([validator.messages.updateError]).end()
            return
        }
        res.status(200).end()
    })
    
    app.post('/addorder', async (req, res) => {
        const {orderNumber, price, currency, cardNumber, expiration, cvv} = req.body,
              {valid, validationErr} = validator.forAdd(orderNumber, price, currency, cardNumber, expiration, cvv)
        if (!valid) {
            res.status(404).json(validationErr).end()
            return
        }
        const orderExists = await db.orderExists(orderNumber)
        if (orderExists) {
            res.status(404).json([validator.messages.orderExists]).end()
            return
        }
        const addSuccessful = await db.addOrder(orderNumber, price, currency, cardNumber, expiration, cvv)
        if (!addSuccessful) {
            res.status(404).json([validator.messages.addError]).end()
            return
        }
        res.status(200).end()
    })
    
    app.delete('/order', async (req, res) => {
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
    })
}
