module.exports = {
    orderNumber: /^\d+$/,
    price:       /^\d+\.\d{2}$/,
    cardNumber:  /^\d{8,19}$/,
    expiration:  /^(0\d|10|11|12)\/\d{2}$/,
    cvv:         /^\d{3,4}$/
}