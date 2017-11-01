const request = require('supertest'),
    server = require('../index')

describe('Currencies', () => {
    test('GET', () => {
        return request(server).get('/currencies')
            .expect(200)
            .then((res) => {
                expect(res.body.length).toBe(2)
            })
    })
})