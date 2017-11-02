const apiport = process.env.PORT || require('./config').apiport,
      express = require('express'),
      bodyParser = require('body-parser'),
      app = express(),
      routes = require('./routes')

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, HEAD")
  next()
})
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'))

app.route('/currencies')
    .get(routes.getCurrencies)

app.route('/order')
    .get(routes.getOrders)
    .put(routes.updateOrder)
    .post(routes.addOrder)
    .delete(routes.deleteOrder)

app.listen(apiport, () => {
    console.log(`API server listening on port ${apiport}`)
})

module.exports = app //Для тестов
