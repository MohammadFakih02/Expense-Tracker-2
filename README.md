//IMPORTANT
The SQL to Create the Tables and triggers:

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(48) NOT NULL,
  `budget` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `price` int(11) NOT NULL,
  `type` varchar(48) NOT NULL,
  `Date` date NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `foreign_key` (`user_id`),
  CONSTRAINT `foreign_key` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci

ALTER TABLE users ADD password VARCHAR(255);

CREATE DEFINER=`root`@`localhost` TRIGGER `change_budget` AFTER INSERT ON `transactions` FOR EACH ROW BEGIN
    IF NEW.type = 'expense' THEN
        UPDATE users
        SET budget = budget - NEW.price
        WHERE id = NEW.user_id;
    ELSEIF NEW.type = 'income' THEN
        UPDATE users
        SET budget = budget + NEW.price
        WHERE id = NEW.user_id;
    END IF;
END
