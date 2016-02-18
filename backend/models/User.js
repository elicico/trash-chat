import { Model, ValidationError } from 'objection'
import { bcryptCompare, bcryptHash } from '../bcrypt'

export default class User extends Model {
  static get tableName() {
    return 'users'
  }

  static get relationMappping() {
    return {
      messages: {
        relation: Model.OneToManyRelation,
        modelClass: __dirname + '/Message',
        join: {
          from: 'users.id',
          to: 'messages.user_id'
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
        username: {
          type: 'string',
          minLength: 1
        },
        password: {
          type: 'string',
          minLength: 5
        }
      },
      required: [ 'username', 'password' ]
    }
  }

  $beforeInsert() {
    return User
      .query()
      .whereRaw("LOWER(users.username) = ?", this.username.toLowerCase())
      .resultSize()
      .then(count => {
        if (count > 0) {
          throw new ValidationError({ name: "is already taken" })
        } else {
          return bcryptHash(this.password)
        }
      })
      .then(hash => {
        this.bcrypt_password = hash
      })
  }

  $toJson() {
    return {
      id: this.id,
      username: this.username
    }
  }

  $formatDatabaseJson(json) {
    delete json.password;
    json.bcrypt_password = this.bcrypt_password;
    return json;
  }
}
