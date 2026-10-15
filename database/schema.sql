
--users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    access_token VARCHAR(200),
    refresh_token VARCHAR(200)
);

--seats table
CREATE TABLE seats (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    isbooked INTEGER DEFAULT 0,
    booked_by_user_id INTEGER REFERENCES users(id)
);
