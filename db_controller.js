const config = require('./config').dbtest,
    pgp = require('pg-promise')(),
    db = pgp(process.env.DATABASE_URL ? process.env.DATABASE_URL + '?ssl=true' : config)

module.exports = {
    getAllCurrencyNames,
    getAllOrders,
    orderExists,
    updateOrder,
    deleteOrder,
    addOrder
}

/**
 * Возвращает все наименования валют
 * @returns {Promise.<Array>} Массив наименований - строк длины 3, если валют нет или произошла ошибка - пустой массив
 */
async function getAllCurrencyNames() {
    try {
        const currencies = await db.any('SELECT name FROM currencies')
        return currencies.map(c => c.name)
    }
    catch(e) {
        console.error('DB error in getAllCurrencies:', e)
        return []
    }
}

/**
 * Возвращает все заказы
 * @returns {Promise<any[]>} Все заказы, если заказов нет - промис с пустым массивом
 */
async function getAllOrders() {
    try {
        return await db.any('SELECT time, order_number, price, currencies.name AS currency, card_number, expiration, cvv, orders.name AS name FROM orders LEFT JOIN currencies ON orders.currency = currencies.id')
    }
    catch(e) {
        console.error('DB error in getAllOrders:', e)
        return []
    }
}

/**
 * Проверяет, есть ли в базе заказ с указанным номером
 * @param number Номер заказа
 * @returns {Promise.<boolean>} есть | нет
 */
async function orderExists(number) {
    try {
        const order = await db.one('SELECT count(1) FROM orders WHERE order_number = $1', [number])
        return order.count > 0
    }
    catch(e) {
        console.error('DB error in orderExists:', e)
        return false
    }
}

/**
 * Обновляет заказ
 * @param order_number Номер заказа
 * @param price Цена
 * @param currency Валюта в формате USD | RUB | ... Значение обязательно должно присутствовать в текущем списке валют
 * @param card_number Номер карты
 * @param expiration Expiration date карты
 * @param cvv CVV карты
 * @param name Имя владельца
 * @returns {Promise.<boolean>} true если был обновлен ровно один заказ, false в ином случае
 */
async function updateOrder(order_number, price, currency, card_number, expiration, cvv, name) {
    try {
        const currencyCode = await db.one('SELECT id FROM currencies WHERE name = $1', [currency])
        const updatedRows = await db.any('UPDATE orders SET price = COALESCE($1, price), currency = COALESCE($2, currency), card_number = COALESCE($3, card_number), expiration = COALESCE($4, expiration), cvv = COALESCE($5, cvv), name = COALESCE($6, name) WHERE order_number = $7 RETURNING order_number', [price, currencyCode.id, card_number, expiration, cvv, name, order_number])
        return updatedRows.length === 1
    }
    catch(e) {
        console.error('DB error in updateOrder:', e)
        return false
    }
}

/**
 * Удаляет заказ с заданным номером
 * @param order_number Номер заказа
 * @returns {Promise.<boolean>}
 */
async function deleteOrder(order_number) {
    try {
        const deletedRowsCount = await db.any('DELETE FROM orders WHERE order_number = $1', [order_number])
        return deletedRowsCount === 1
    }
    catch(e) {
        console.error('DB error in deleteOrder:', e)
        return false
    }
}

/**
 * Добавляет заказ
 * @param order_number Номер заказа
 * @param price Цена
 * @param currency Валюта в формате USD | RUB | ... Значение обязательно должно присутствовать в текущем списке валют
 * @param card_number Номер карты
 * @param expiration Expiration date карты
 * @param cvv CVV карты
 * @param name Имя владельца
 * @returns {Promise.<boolean>} true если был добавлен ровно один заказ, false в ином случае
 */
async function addOrder(order_number, price, currency, card_number, expiration, cvv, name) {
    try {
        const currencyCode = await db.one('SELECT id FROM currencies WHERE name = $1', [currency])
        const insertedRows = await db.any('INSERT INTO orders (order_number, price, currency, card_number, expiration, cvv, name) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING order_number', [order_number, price, currencyCode.id, card_number, expiration, cvv, name])
        return insertedRows.length === 1
    }
    catch(e) {
        console.error('DB error in addOrder:', e)
        return false
    }
}
