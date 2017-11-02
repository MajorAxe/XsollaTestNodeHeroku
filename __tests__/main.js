const request = require('supertest'),
    server = require('../index'),
    ordersToAddValid = require('./mock_data_add_valid.json'),
    ordersToUpdateValid = require('./mock_data_update_valid.json')

describe('Currencies', () => {
    test('GET returns array with RUB and USD', async () => {
        const mandatoryCurrencies = ['RUB', 'USD'],
            res = await request(server).get('/currencies').expect(200)
        expect(res.body).toEqual(expect.arrayContaining(mandatoryCurrencies))
    })
})

describe('Orders', () => {
    describe('Valid data', () => {
        test('Clear database', async () => {
            const res = await request(server).get('/order').expect(200),
                orderIDS = res.body.map(r => r.order_number)
            for (id of orderIDS) {
                await request(server).delete('/order').type('form').send('orderNumber=' + id).expect(200)
            }
        })
        test('GET orders returns empty array', async () => {
            const res = await request(server).get('/order').expect(200)
            expect(res.body.length).toBe(0)
        })
        test('Add 1000 valid orders', async () => {
            for (let order of ordersToAddValid) {
                await request(server).post('/order').type('form').send(order).expect(200)
            }
        })
        test('Check posted orders', async () => {
            const res = await request(server).get('/order').expect(200)
            expect(res.body.length).toEqual(ordersToAddValid.length)
            // const formattedResponse = res.body.map(r => {
            //     return {
            //         orderNumber: r.order_number,
            //         price: r.price,
            //         currency: r.currency,
            //         cardNumber: r.card_number,
            //         expiration: r.expiration,
            //         cvv: r.cvv,
            //         name: r.name
            //     }
            // })
            // expect(formattedResponse).toEqual(ordersToAddValid)
        })
    })
    describe('Invalid data', () => {
        test('No test yet', () => {
            //test for invalid data processing
        })
    })
})
