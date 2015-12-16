import express from 'express'
import bodyParser from 'body-parser'
import cors from 'express-cors'
import pg from 'pg-promise'
import bcrypt from 'bcrypt-nodejs'

const pgp = pg()
const db = pgp('postgres://cantiere@127.0.0.1/chat')

let bcryptHash = function(password) {
  return new Promise(function(resolve, reject) {
    bcrypt.hash(password, null, null, function(err, hash) {
      if (err) {
        reject(err)
      } else {
        resolve(hash)
      }
    })
  })
}

let bcryptCompare = function(password, hash) {
  return new Promise(function(resolve, reject) {
    bcrypt.compare(password, hash, function(err, res) {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

let app = express()

let currentUser = null

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.json())


app.get('/rooms', function (req, res) {

  db.query("SELECT * FROM rooms")
  .then((data) => {
    res.json(data)
  })
  .catch((err) => {
    res.status(500)
    res.json({ "error": true, "message": err })
  })
})


app.get('/rooms/:id', function (req, res) {

  db.one("SELECT * FROM rooms WHERE id = $1", parseInt(req.params.id))
  .then((data) => {
    if (data.length === 0) {
      res.status(404)
      res.json({ "error": true, "message": "record not found" })
    } else {
      res.json(data)
    }
  })
  .catch((err) => {
    res.status(500)
    res.json({ "error": true, "message": err })
  })
})


app.post('/rooms', function(req, res) {

  let room = req.body

  db.one("SELECT COUNT(*) AS count FROM rooms WHERE name = $1", room.name)
  .then(({ count }) => {
    if (count > 0) {
      throw "room già esistente"
    } else {
      return db.one("INSERT INTO rooms (name) VALUES ($1) RETURNING *", room.name)
      }
    })
    .then(({ id, name }) => {
      res.status(201)
      res.json({ id, name })
    })
    .catch((err) => {
      res.status(500)
      res.json({ "error": true, "message": err })
    })
})


app.get('/rooms/:roomId/messages', function(req, res) {

  db.query("SELECT * FROM messages WHERE room_id = $1", parseInt(req.params.roomId))
  .then((data) => {
    if (req.query.idLessThan) {
      db.query("SELECT * FROM messages WHERE id < $1", parseInt(req.query.idLessThan))
      .then((old) => {
        let olderMessages = old.slice(0, 10)
        res.json(olderMessages)
      })
    } else {
      let lastMessages = data.slice(0, 10)
      res.json(lastMessages)
    }
  })
  .catch((err) => {
    res.status(500)
    res.json({ "error": true, "message": err })
  })

  // let lastMessages = messages.filter(message => message.roomId == parseInt(req.params.roomId))
  // if (req.query.idLessThan) {
  //   lastMessages = lastMessages.filter(message => message.id < parseInt(req.query.idLessThan))
  // }
  // lastMessages = lastMessages.slice(0, 10)
  // res.json(lastMessages)
})


app.get('/messages/:id', function(req, res) {

  db.one("SELECT * FROM messages WHERE id = $1", parseInt(req.params.id))
  .then((data) => {
    res.json(data)
  })
  .catch((err) => {
    res.status(500)
    res.json({ "error": true, "message": err })
  })
})


app.post('/messages', function(req, res) {

  let message = req.body

  db.one(
    "INSERT INTO messages (message, room_id, user_id) VALUES ($1, $2, $3) RETURNING *",
    [ message.message, message.room_id, message.user_id ]
  )
  .then((data) => {
    res.status(201)
    res.json(data)
  })
  .catch((err) => {
    res.status(500)
    res.json({ "error": true, "message": err })
  })
})


app.get('/users', function(req, res) {

  db.query("SELECT id, username FROM users")
  .then((data) => {
    res.json(data)
  })
  .catch((err) => {
    res.status(500)
    res.json({ "error": true, "message": err })
  })
})


app.get('/users/:id', function(req, res) {

  db.one("SELECT id, username FROM users WHERE id = $1", parseInt(req.params.id))
  .then((data) => {
    if (data.length === 0) {
      res.status(404)
      res.json({ "error": true, "message": "record not found" })
    } else {
      res.json(data)
    }
  })
  .catch((err) => {
    res.status(500)
    res.json({ "error": true, "message": err })
  })
})


app.post('/users', function(req, res) {
  let user = req.body

  db.one("SELECT COUNT(*) AS count FROM users WHERE username = $1", user.username)
  .then(({ count }) => {
    if (count > 0) {
      throw "username già esistente"
    } else {
      return bcryptHash(user.password)
    }
  })
  .then((hash) => {
    return db.one(
      "INSERT INTO users (username, bcrypt_password) VALUES ($1, $2) RETURNING *",
      [ user.username, hash ]
    )
  })
  .then(({ id, username }) => {
    res.status(201)
    res.json({ id, username })
  })
  .catch((err) => {
    res.status(500)
    res.json({ "error": true, "message": err })
  })
})


app.post('/users/authenticate', function(req, res) {
  let user = null;

  db.one("SELECT * FROM users WHERE username = $1", req.body.username)
  .then((row) => {
    user = row
    return bcryptCompare(req.body.password, row.bcrypt_password)
  })
  .then((isEqual) => {
    if (isEqual) {
      console.log(user)
      res.json({ id: user.id, username: user.username })
    }
  })
  .catch((err) => {
    res.status(500)
    res.json({ "error": true, "message": err })
  })
})
// 
//
// app.post('/users/current', function(req, res) {
//   let user = users.find(user => user.name === req.body.name && user.password == req.body.password)
//   currentUser = user
//   res.json(currentUser)
// })
//
//
// app.get('/current', function(req, res) {
//   let curr = currentUser
//   res.json(curr)
// })


app.listen(3517)
