CREATE TABLE `Users`
(
    `id`         INT PRIMARY KEY AUTO_INCREMENT,
    `username`   VARCHAR(25) UNIQUE  NOT NULL,
    `password`   VARCHAR(512)        NOT NULL,
    `email`      VARCHAR(200) UNIQUE NOT NULL,
    `XP`         INT       DEFAULT 0,
    `LVL`        INT       DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT (now()),
    `updated_at` TIMESTAMP
);

CREATE TABLE `UserSessions`
(
    `id`         INT PRIMARY KEY AUTO_INCREMENT,
    `user_id`    INT      NOT NULL,
    `token_hash` CHAR(64) NOT NULL,
    `expires_at` DATETIME NOT NULL,
    `revoked_at` DATETIME,
    `user_agent` VARCHAR(255),
    `ip_address` VARCHAR(45),
    `created_at` TIMESTAMP DEFAULT (now()),
    UNIQUE KEY `uq_user_sessions_token_hash` (`token_hash`),
    KEY `idx_user_sessions_user_id` (`user_id`),
    KEY `idx_user_sessions_expires_at` (`expires_at`),
    FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`) ON DELETE CASCADE
);

CREATE TABLE `Picture`
(
    `id`          INT PRIMARY KEY AUTO_INCREMENT,
    `img_blob`    LONGBLOB NOT NULL,
    `alt_text`    VARCHAR(200),
    `uploaded_at` TIMESTAMP DEFAULT (now())
);

CREATE TABLE `Recipe`
(
    `id`               INT PRIMARY KEY AUTO_INCREMENT,
    `name`             VARCHAR(100) NOT NULL,
    `description`      TEXT,
    `cooking_time`     INT COMMENT 'in minutes',
    `preparation_time` INT COMMENT 'in minutes',
    `difficulty`       VARCHAR(6) COMMENT 'easy, medium, hard',
    `XP_winnable`      INT       DEFAULT 100,
    `id_picture`       INT,
    `id_user`          INT          NOT NULL COMMENT 'creator of the recipe',
    `created_at`       TIMESTAMP DEFAULT (now()),
    `updated_at`       TIMESTAMP,
    FOREIGN KEY (`id_user`) REFERENCES `Users` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`id_picture`) REFERENCES `Picture` (`id`) ON DELETE SET NULL
);

CREATE TABLE `Ingredient`
(
    `id`         INT PRIMARY KEY AUTO_INCREMENT,
    `name`       VARCHAR(100) UNIQUE NOT NULL,
    `category`   VARCHAR(50) COMMENT 'vegetable, meat, spice, etc.',
    `created_at` TIMESTAMP DEFAULT (now())
);

CREATE TABLE `RecipeIngredient`
(
    `id_recipe`     INT NOT NULL,
    `id_ingredient` INT NOT NULL,
    `quantity`      DECIMAL(10, 2),
    `unit`          VARCHAR(20) COMMENT 'g, ml, spoon, unit',
    PRIMARY KEY (`id_recipe`, `id_ingredient`),
    FOREIGN KEY (`id_recipe`) REFERENCES `Recipe` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`id_ingredient`) REFERENCES `Ingredient` (`id`) ON DELETE CASCADE
);

CREATE TABLE `ProfilePicture`
(
    `id`          INT PRIMARY KEY AUTO_INCREMENT,
    `id_user`     INT NOT NULL,
    `id_picture`  INT NOT NULL,
    UNIQUE KEY `uq_profile_picture_user_id` (`id_user`),
    FOREIGN KEY (`id_user`) REFERENCES `Users` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`id_picture`) REFERENCES `Picture` (`id`) ON DELETE CASCADE
);

CREATE TABLE `RecipePicture`
(
    `id`          INT PRIMARY KEY AUTO_INCREMENT,
    `id_recipe`   INT NOT NULL,
    `id_picture`  INT NOT NULL,
    FOREIGN KEY (`id_recipe`) REFERENCES `Recipe` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`id_picture`) REFERENCES `Picture` (`id`) ON DELETE CASCADE
);

CREATE TABLE `Favory`
(
    `id_user`   INT NOT NULL,
    `id_recipe` INT NOT NULL,
    `added_at`  TIMESTAMP DEFAULT (now()),
    PRIMARY KEY (`id_user`, `id_recipe`),
    FOREIGN KEY (`id_user`) REFERENCES `Users` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`id_recipe`) REFERENCES `Recipe` (`id`) ON DELETE CASCADE
);

CREATE TABLE `Notation`
(
    `id_user`    INT NOT NULL,
    `id_recipe`  INT NOT NULL,
    `rating`     INT NOT NULL COMMENT '1 to 5 stars',
    `comment`    TEXT,
    `created_at` TIMESTAMP DEFAULT (now()),
    `updated_at` TIMESTAMP,
    PRIMARY KEY (`id_user`, `id_recipe`),
    FOREIGN KEY (`id_user`) REFERENCES `Users` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`id_recipe`) REFERENCES `Recipe` (`id`) ON DELETE CASCADE
);

CREATE TABLE `Filters`
(
    `id`   INT PRIMARY KEY AUTO_INCREMENT,
    `name` varchar(100),
    `type` varchar(50)
);

CREATE TABLE `RecipeFiltres`
(
    `id_recipe` INT NOT NULL,
    `id_filter` INT NOT NULL,
    PRIMARY KEY (`id_recipe`, `id_filter`),
    FOREIGN KEY (`id_recipe`) REFERENCES `Recipe` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`id_filter`) REFERENCES `Filters` (`id`) ON DELETE CASCADE
);

