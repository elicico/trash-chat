CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  bcrypt_password TEXT NOT NULL
);

CREATE UNIQUE INDEX username ON users (username);

CREATE TABLE rooms (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE UNIQUE INDEX name ON rooms (name);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  message TEXT NOT NULL,
  sent_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() at time zone 'utc'),
  room_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL
);

CREATE INDEX room_id ON messages (room_id);
