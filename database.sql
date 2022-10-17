CREATE DATABASE IF NOT EXISTS jwtlogin;

--set extention in terminal  (create extension if not exists "uuid-ossp";)
CREATE TABLE users(
  user_id uuid PRIMARY KEY DEFAULT
  uuid_generate_v4(),
  user_name VARCHAR (255) NOT NULL,
  user_email VARCHAR (255) NOT NULL,
  user_password VARCHAR (255) NOT NULL
);

--insert fake users

INSERT INTO users (user_name, user_email, user_password) VALUES ('milan', "mvhsabaj@gmail.com", 'Milan123');




