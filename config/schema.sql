DROP TABLE IF EXISTS recipe_filters CASCADE;
DROP TABLE IF EXISTS filters CASCADE;
DROP TABLE IF EXISTS notation CASCADE;
DROP TABLE IF EXISTS favory CASCADE;
DROP TABLE IF EXISTS recipe_picture CASCADE;
DROP TABLE IF EXISTS profile_picture CASCADE;
DROP TABLE IF EXISTS recipe_ingredient CASCADE;
DROP TABLE IF EXISTS ingredient CASCADE;
DROP TABLE IF EXISTS recipe CASCADE;
DROP TABLE IF EXISTS picture CASCADE;
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(25) UNIQUE NOT NULL,
    password VARCHAR(512) NOT NULL,
    email VARCHAR(200) UNIQUE NOT NULL,
    xp INT DEFAULT 0,
    lvl INT DEFAULT 1,
    role INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP
);

CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    token_hash CHAR(64) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    revoked_at TIMESTAMP,
    user_agent VARCHAR(255),
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_expires_at ON user_sessions(expires_at);

CREATE TABLE picture (
    id SERIAL PRIMARY KEY,
    img_blob BYTEA NOT NULL,
    alt_text VARCHAR(200),
    uploaded_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE recipe (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    cooking_time INT,
    preparation_time INT,
    difficulty VARCHAR(6),
    xp_winnable INT DEFAULT 100,
    id_picture INT,
    id_user INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (id_picture) REFERENCES picture (id) ON DELETE SET NULL
);

CREATE TABLE ingredient (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE recipe_ingredient (
    id_recipe INT NOT NULL,
    id_ingredient INT NOT NULL,
    quantity DECIMAL(10, 2),
    unit VARCHAR(20),
    PRIMARY KEY (id_recipe, id_ingredient),
    FOREIGN KEY (id_recipe) REFERENCES recipe (id) ON DELETE CASCADE,
    FOREIGN KEY (id_ingredient) REFERENCES ingredient (id) ON DELETE CASCADE
);

CREATE TABLE profile_picture (
    id SERIAL PRIMARY KEY,
    id_user INT NOT NULL UNIQUE,
    id_picture INT NOT NULL,
    FOREIGN KEY (id_user) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (id_picture) REFERENCES picture (id) ON DELETE CASCADE
);

CREATE TABLE recipe_picture (
    id SERIAL PRIMARY KEY,
    id_recipe INT NOT NULL,
    id_picture INT NOT NULL,
    FOREIGN KEY (id_recipe) REFERENCES recipe (id) ON DELETE CASCADE,
    FOREIGN KEY (id_picture) REFERENCES picture (id) ON DELETE CASCADE
);

CREATE TABLE favory (
    id_user INT NOT NULL,
    id_recipe INT NOT NULL,
    added_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (id_user, id_recipe),
    FOREIGN KEY (id_user) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (id_recipe) REFERENCES recipe (id) ON DELETE CASCADE
);

CREATE TABLE notation (
    id_user INT NOT NULL,
    id_recipe INT NOT NULL,
    rating INT NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP,
    PRIMARY KEY (id_user, id_recipe),
    FOREIGN KEY (id_user) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (id_recipe) REFERENCES recipe (id) ON DELETE CASCADE
);

CREATE TABLE filters (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    type VARCHAR(50)
);

CREATE TABLE recipe_filters (
    id_recipe INT NOT NULL,
    id_filter INT NOT NULL,
    PRIMARY KEY (id_recipe, id_filter),
    FOREIGN KEY (id_recipe) REFERENCES recipe (id) ON DELETE CASCADE,
    FOREIGN KEY (id_filter) REFERENCES filters (id) ON DELETE CASCADE
);