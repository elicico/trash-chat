import objection from 'objection'
import { bcryptCompare, bcryptHash } from './bcrypt'
import Room from './models/Room'
import Message from './models/Message'
import User from './models/User'

export default function(app) {

  app.get('/rooms', function (req, res, next) {
    Room
      .query()
      .then(rooms => res.json(rooms))
      .catch(next)
  })


  app.get('/rooms/:id', function (req, res, next) {
    Room
      .query()
      .where('id', req.params.id)
      .first()
      .then(room => {
        if(room) {
          res.json(room)
        } else {
          throwNotFound()
        }
      })
      .catch(next)
  })


  app.post('/rooms', function({ body }, res, next) {
    Room
      .query()
      .insert(body)
      .then(room => res.json(room))
      .catch(next)
  })


  app.get('/rooms/:roomId/messages', function(req, res, next) {
    let dbQuery = Message
                  .query()
                  .orderBy('sent_at', 'desc')
                  .limit(10)
                  .where('room_id', req.params.roomId)

    if (req.query.idLessThan) {
      dbQuery = dbQuery.where('id', '<', req.query.idLessThan)
    }

    dbQuery
      .then(messsages => res.json(messages))
      .catch(next)
  })


  app.get('/messages/:id', function(req, res, next) {
    Message
      .query()
      .where('id', req.params.id)
      .first()
      .then(message => {
        if (message) {
          res.json(message)
        } else {
          throwNotFound()
        }
      })
      .catch(next)
  })


  app.post('/messages', function({ body }, res, next) {
    Message
      .query()
      .insert(body)
      .then(message => res.json(message))
      .catch(next)
  })


  app.get('/users', function(req, res, next) {
    User
      .query()
      .then(users => res.json(users))
      .catch(next)
  })


  app.get('/users/:id', function(req, res, next) {
    User
      .query()
      .where('id', req.params.id)
      .first()
      .then(user => {
        if (user) {
          res.json(user)
        } else {
          throwNotFound()
        }
      })
      .catch(next)
  })


  app.post('/users', function({ body }, res, next) {
    User
      .query()
      .insert(body)
      .then((user) => {
        res.status(201).json(user)
      })
      .catch(next)
  })


  app.post('/users/authenticate', function({ body }, res, next) {
    User
      .query()
      .where('username', body.username)
      .first()
      .then(user => {
        if (user) {
          return user
        } else {
          throwNotFound()
        }
      })
      .then(user => {
        return bcryptCompare(body.password, user.bcrypt_password)
          .then(isEqual => [ isEqual, user ])
      })
      .then(([isEqual, user]) => {
        if (isEqual) {
          res.json(user)
        } else {
          let error = new Error("invalid password")
          error.status = 401
          throw error
        }
      })
      .catch(next)

    // let user = null;
    //
    // db.one("SELECT * FROM users WHERE username = $1", req.body.username)
    // .then((row) => {
    //   user = row
    //   return bcryptCompare(req.body.password, row.bcrypt_password)
    // })
    // .then((isEqual) => {
    //   if (isEqual) {
    //     console.log(user)
    //     res.json({ id: user.id, username: user.username })
    //   }
    // })
    // .catch(next)
  })

}

function throwNotFound() {
  var error = new Error("resource not found")
  error.statusCode = 404
  throw error
}
