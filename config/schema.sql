CREATE TABLE `Users` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `username` VARCHAR(25) UNIQUE NOT NULL,
  `password` VARCHAR(50) NOT NULL,
  `email` VARCHAR(200) UNIQUE NOT NULL,
  `XP` INT DEFAULT 0,
  `LVL` INT DEFAULT 1,
  `profile_picture_id` INT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT (now()),
  `updated_at` TIMESTAMP
);

CREATE TABLE `Recipe` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `cooking_time` INT COMMENT 'in minutes',
  `preparation_time` INT COMMENT 'in minutes',
  `difficulty` VARCHAR(6) COMMENT 'easy, medium, hard',
  `XP_winnable` INT DEFAULT 100,
  `id_picture` INT,
  `id_user` INT NOT NULL COMMENT 'creator of the recipe',
  `created_at` TIMESTAMP DEFAULT (now()),
  `updated_at` TIMESTAMP
);

CREATE TABLE `Ingredient` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(100) UNIQUE NOT NULL,
  `category` VARCHAR(50) COMMENT 'vegetable, meat, spice, etc.',
  `created_at` TIMESTAMP DEFAULT (now())
);

CREATE TABLE `RecipeIngredient` (
  `id_recipe` INT NOT NULL,
  `id_ingredient` INT NOT NULL,
  `quantity` DECIMAL(10,2),
  `unit` VARCHAR(20) COMMENT 'g, ml, spoon, unit',
  PRIMARY KEY (`id_recipe`, `id_ingredient`)
);

CREATE TABLE `Picture` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `url` VARCHAR(500) NOT NULL,
  `type` VARCHAR(20) COMMENT 'recipe, step, profile',
  `alt_text` VARCHAR(200),
  `uploaded_at` TIMESTAMP DEFAULT (now())
);

CREATE TABLE `Favory` (
  `id_user` INT NOT NULL,
  `id_recipe` INT NOT NULL,
  `added_at` TIMESTAMP DEFAULT (now()),
  PRIMARY KEY (`id_user`, `id_recipe`)
);

CREATE TABLE `Notation` (
  `id_user` INT NOT NULL,
  `id_recipe` INT NOT NULL,
  `rating` INT NOT NULL COMMENT '1 to 5 stars',
  `comment` TEXT,
  `created_at` TIMESTAMP DEFAULT (now()),
  `updated_at` TIMESTAMP,
  PRIMARY KEY (`id_user`, `id_recipe`)
);

CREATE TABLE `RecipeFiltres` (
  `id_recettes` INT NOT NULL,
  `id_filtres` INT NOT NULL
);

CREATE TABLE `Filters` (
  `id` INT PRIMARY KEY NOT NULL,
  `name` varchar(100),
  `type` varchar(50)
);

ALTER TABLE `Recipe` ADD FOREIGN KEY (`id_user`) REFERENCES `Users` (`id`) ON DELETE CASCADE;

ALTER TABLE `Recipe` ADD FOREIGN KEY (`id_picture`) REFERENCES `Picture` (`id`) ON DELETE SET NULL;

ALTER TABLE `RecipeIngredient` ADD FOREIGN KEY (`id_recipe`) REFERENCES `Recipe` (`id`) ON DELETE CASCADE; 
ALTER TABLE `RecipeIngredient` ADD FOREIGN KEY (`id_ingredient`) REFERENCES `Ingredient` (`id`) ON DELETE CASCADE;

ALTER TABLE `Favory` ADD FOREIGN KEY (`id_user`) REFERENCES `Users` (`id`) ON DELETE CASCADE;

ALTER TABLE `Favory` ADD FOREIGN KEY (`id_recipe`) REFERENCES `Recipe` (`id`) ON DELETE CASCADE;

ALTER TABLE `Notation` ADD FOREIGN KEY (`id_user`) REFERENCES `Users` (`id`) ON DELETE CASCADE;

ALTER TABLE `Notation` ADD FOREIGN KEY (`id_recipe`) REFERENCES `Recipe` (`id`) ON DELETE CASCADE;
-- ALTER TABLE `Recipe` ADD FOREIGN KEY (`id`) REFERENCES `RecipeFiltres` (`id_recipes`);

-- ALTER TABLE `Filters` ADD FOREIGN KEY (`id`) REFERENCES `RecipeFiltres` (`id_filters`);

ALTER TABLE `Users` ADD FOREIGN KEY (`profile_picture_id`) REFERENCES Picture(id);