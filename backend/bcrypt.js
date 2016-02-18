import bcrypt from 'bcrypt-nodejs'

export let bcryptHash = function(password) {
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

export let bcryptCompare = function(password, hash) {
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
