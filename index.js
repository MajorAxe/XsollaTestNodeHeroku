const config = require('../config'),
      express = require('express'),
      bodyParser = require('body-parser'),
      app = express(),
      db = require('./db_controller'),
      validator = require('./validation')
      
app.use(bodyParser.urlencoded({ extended: false }))

require('./routes')(app, db, validator)

app.listen(config.apiport, () => {
    console.log(`API server listening on port ${config.apiport}`)
})