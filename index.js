const config = require('../config'),
      express = require('express'),
      bodyParser = require('body-parser'),
      app = express(),
      routes = require('./routes')
      
app.use(bodyParser.urlencoded({ extended: false }))

app.route('/currencies')
    .get(routes.getCurrencies)

app.route('/order')
    .get(routes.getOrders)
    .put(routes.updateOrder)
    .post(routes.addOrder)
    .delete(routes.deleteOrder)

app.listen(config.apiport, () => {
    console.log(`API server listening on port ${config.apiport}`)
})

module.exports = app //Для тестов
