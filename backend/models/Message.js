import { Model, ValidationError } from 'objection'
import Room from './Room'
import User from './User'


export default class Message extends Model {
  static get tableName() {
    return 'messages'
  }

  static get relationMappping() {
    return {
      room: {
        relation: Model.OneToOneRelation,
        modelClass: __dirname + '/Room',
        join: {
          from: 'messages.room_id',
          to: 'rooms.id'
        }
      },
      user: {
        relation: Model.OneToOneRelation,
        modelClass: __dirname + '/User',
        join: {
          from: 'messages.user_id',
          to: 'users.id'
        }
      }
    }
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        id: {
          type: 'integer'
        },
        message: {
          type: 'string',
          minLength: 1
        },
        room_id: {
          type: 'integer'
        },
        user_id: {
          type: 'integer'
        },
        sent_at: {
          type: 'string',
          format: 'date-time'
        }
      },
      required: [ 'message', 'room_id', 'user_id' ]
    }
  }

  $parseJson(json, options) {
    return Object.assign(
      {}, json,
      { message: json.message.trim() }
    );
  }

  $beforeInsert() {
    let roomValidationPromise = Room
      .query()
      .where("id", this.room_id)
      .resultSize()
      .then(count => {
        if (count === 0) {
          throw new ValidationError({ room_id: "does not exist" })
        }
      });

      let userValidationPromise = User
        .query()
        .where("id", this.user_id)
        .resultSize()
        .then(count => {
          if (count === 0) {
            throw new ValidationError({ user_id: "does not exist" })
          }
        });

      return Promise.all([ roomValidationPromise, userValidationPromise ])
  }

}
