const availableCurrencies = ['USD', 'RUB'],
    patterns = require('./patterns'),
    messages = require('./messages')
    
module.exports = {
    orderNumber,
    price,
    currency,
    cardNumber,
    expirationDateValid,
    expirationDateActual,
    cvv,
    forUpdate,
    forAdd,
    messages
}

/**
 * Валидация номера заказа. Предполагает что номер заказа - целое число
 * @param number
 * @returns {boolean}
 */
function orderNumber(number) {
    return number && patterns.orderNumber.test(number)
}

/**
 * Валидация цены.
 * @param price
 * @returns {boolean}
 */
function price(price) {
    return price && patterns.price.test(price)
}

/**
 * Валидация валюты.
 * @param currency
 * @returns {boolean}
 */
function currency(currency) {
    return currency && availableCurrencies.indexOf(currency) > -1
}

/**
 * Валидация номера карты по соответствию маске и алгоритму Луна
 * @param number
 * @returns {boolean}
 */
function cardNumber(number) {
    return number && patterns.cardNumber.test(number) && luhnCheck(number)
}

/**
 * Валидация expiration date
 * @param exp
 * @returns {boolean}
 */
function expirationDateValid(exp) {
    return exp && patterns.expiration.test(exp)
}

/**
 * Проверка актуальности expiration date
 * @param exp
 * @returns {boolean}
 */
function expirationDateActual(exp) {
    if (!exp || !patterns.expiration.test(exp)) return false
    const [month, year] = exp.split('/'),
        expires = new Date(month + '/01/' + year)
    return expires > new Date()
}

/**
 * Валидация CVV
 * @param cvv
 * @returns {boolean}
 */
function cvv(cvv) {
    return cvv && patterns.cvv.test(cvv)
}

/**
 * Валидация для метода update, проверяет все поля заказа, при этом допускает null и undefined для всех, кроме номера заказа
 * @param orderNumber Номер заказа
 * @param price Цена
 * @param currency Валюта
 * @param cardNumber Номер карты
 * @param expiration
 * @param cvv
 * @returns {{valid: boolean, validationErr: <Array>}} valid - пройден ли тест, validationErr - сообщения об ошибке
 */
function forUpdate(orderNumber, price, currency, cardNumber, expiration, cvv) {
    let valid = true,
        validationErr = []
    if (!this.orderNumber(orderNumber)) {
        validationErr.push(messages.orderNumberInvalid)
        valid = false
    }
    if (price && !this.price(price)) {
        validationErr.push(messages.priceInvalid)
        valid = false
    }
    if (currency && !this.currency(currency)) {
        validationErr.push(messages.currencyInvalid)
        valid = false
    }
    if (cardNumber && !this.cardNumber(cardNumber)) {
        validationErr.push(messages.cardNumberInvalid)
        valid = false
    }
    if (expiration && !this.expirationDateValid(expiration)) {
        validationErr.push(messages.expirationDateInvalid)
        valid = false
    }
    if (expiration && !this.expirationDateActual(expiration)) {
        validationErr.push(messages.expirationDateExpired)
        valid = false
    }
    if (cvv && !this.cvv(cvv)) {
        validationErr.push(messages.cvvInvalid)
        valid = false
    }
    return {valid, validationErr}
}

/**
 * Валидация для метода add, проверяет все поля заказа, не допускает null и undefined
 * @param orderNumber Номер заказа
 * @param price Цена
 * @param currency Валюта
 * @param cardNumber Номер карты
 * @param expiration
 * @param cvv
 * @returns {{valid: boolean, validationErr: <Array>}} valid - пройден ли тест, validationErr - сообщения об ошибке
 */
function forAdd(orderNumber, price, currency, cardNumber, expiration, cvv) {
    let valid = true,
        validationErr = []
    if (!this.orderNumber(orderNumber)) {
        validationErr.push(messages.orderNumberInvalid)
        valid = false
    }
    if (!this.price(price)) {
        validationErr.push(messages.priceInvalid)
        valid = false
    }
    if (!this.currency(currency)) {
        validationErr.push(messages.currencyInvalid)
        valid = false
    }
    if (!this.cardNumber(cardNumber)) {
        validationErr.push(messages.cardNumberInvalid)
        valid = false
    }
    if (!this.expirationDateValid(expiration)) {
        validationErr.push(messages.expirationDateInvalid)
        valid = false
    }
    if (!this.expirationDateActual(expiration)) {
        validationErr.push(messages.expirationDateExpired)
        valid = false
    }
    if (!this.cvv(cvv)) {
        validationErr.push(messages.cvvInvalid)
        valid = false
    }
    return {valid, validationErr}
}

/**
 * Проверка контрольной суммы номера карты по алгоритму Луна
 * @param number
 * @returns {boolean}
 */
function luhnCheck(number) {
    let sum = 0,
        double = false
    number = String(number)
    for (let n = number.length - 1; n >= 0; n--) {
        let digit = parseInt(number.charAt(n), 10)
        if (double) {
            digit *= 2
            if (digit > 9) digit -= 9
        }
        sum += digit
        double = !double
    }
    return (sum % 10) === 0 && sum > 0
}
