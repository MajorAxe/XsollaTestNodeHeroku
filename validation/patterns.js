module.exports = {
    orderNumber: /^\d+$/,
    price:       /^\d+\.\d{2}$/,
    cardNumber:  /^\d{13,19}$/,
    expiration:  /^(0[1-9]|1[0-2])\/\d{2}$/,
    cvv:         /^\d{3,4}$/,
    name:        /^[A-Za-z]+\s[A-Za-z]+$/
}