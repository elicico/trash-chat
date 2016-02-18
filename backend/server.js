import express from 'express'
import bodyParser from 'body-parser'
import bcrypt from 'bcrypt-nodejs'
import Knex from 'knex'
import knexConfig from './knexfile'
import registerApi from './api'
import { Model } from 'objection'


let knex = Knex(knexConfig.development)
Model.knex(knex)

let app = express()
  .use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
  })
  .use(bodyParser.json())

registerApi(app)

// Error handling.
app.use(function (err, req, res, next) {
  if (err) {
    console.log(err.stack);
    res.status(err.statusCode || err.status || 500).json({ message: err.data || err.message || "" });
  } else {
    next();
  }
});

app.listen(3517)
