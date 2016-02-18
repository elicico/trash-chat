import { Model, ValidationError } from 'objection'

export default class Room extends Model {
  static get tableName() {
    return 'rooms'
  }

  static get relationMappping() {
    return {
      messages: {
        relation: Model.OneToManyRelation,
        modelClass: __dirname + '/Message',
        join: {
          from: 'rooms.id',
          to: 'messages.room_id'
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
        name: {
          type: 'string',
          minLength: 1
        }
      },
      required: [ 'name' ]
    }
  }

  $parseJson({ name }, options) {
    return {
      name: name.trim()
    }
  }

  $beforeInsert() {
    return Room
      .query()
      .whereRaw("LOWER(rooms.name) = ?", this.name.toLowerCase())
      .resultSize()
      .then(count => {
        if (count > 0) {
          throw new ValidationError({ name: "is already taken" })
        }
      });
  }
}
