const chai = require('chai'),
    chaiHttp = require('chai-http'),
    server = require('../index'),
    should = chai.should()

chai.use(chaiHttp)

describe('Currencies', () => {
    describe('/GET currencies', () => {
        it('it should GET all currencies', done => {
            chai.request(server)
                .get('/currencies')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('array')
                    res.body.length.should.be.eql(2)
                    done()
                })
        })
    })
})

describe('Orders', () => {
    describe('/GET order', () => {
        it('it should GET all requests', done => {
            chai.request(server)
                .get('/order')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('array')
                    done()
                })
        })
    })
})