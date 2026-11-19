-- Dummy user accounts for local development and testing
-- Shared test password: TaskDemo@123
-- Passwords are hashed using bcrypt (10 salt rounds).
-- Do not use these accounts in production.

INSERT INTO users (name, email, password_hash, role)
VALUES
('Rahul Sharma', 'rahul.admin@example.com', '$2b$10$ufBfdKgt5QkZieIyxhAkvezmtvuf8lZ/fLbcLem5RiWBf8VbfM.iO', 'ADMIN'),
('Priya Verma', 'priya.admin@example.com', '$2b$10$ufBfdKgt5QkZieIyxhAkvezmtvuf8lZ/fLbcLem5RiWBf8VbfM.iO', 'ADMIN'),
('Arjun Kumar', 'arjun.admin@example.com', '$2b$10$ufBfdKgt5QkZieIyxhAkvezmtvuf8lZ/fLbcLem5RiWBf8VbfM.iO', 'ADMIN'),
('Sneha Reddy', 'sneha.user@example.com', '$2b$10$ufBfdKgt5QkZieIyxhAkvezmtvuf8lZ/fLbcLem5RiWBf8VbfM.iO', 'USER'),
('Kiran Patel', 'kiran.user@example.com', '$2b$10$ufBfdKgt5QkZieIyxhAkvezmtvuf8lZ/fLbcLem5RiWBf8VbfM.iO', 'USER'),
('Ananya Singh', 'ananya.user@example.com', '$2b$10$ufBfdKgt5QkZieIyxhAkvezmtvuf8lZ/fLbcLem5RiWBf8VbfM.iO', 'USER'),
('Rohit Das', 'rohit.user@example.com', '$2b$10$ufBfdKgt5QkZieIyxhAkvezmtvuf8lZ/fLbcLem5RiWBf8VbfM.iO', 'USER'),
('Meera Joshi', 'meera.user@example.com', '$2b$10$ufBfdKgt5QkZieIyxhAkvezmtvuf8lZ/fLbcLem5RiWBf8VbfM.iO', 'USER'),
('Vikram Rao', 'vikram.user@example.com', '$2b$10$ufBfdKgt5QkZieIyxhAkvezmtvuf8lZ/fLbcLem5RiWBf8VbfM.iO', 'USER'),
('Neha Gupta', 'neha.user@example.com', '$2b$10$ufBfdKgt5QkZieIyxhAkvezmtvuf8lZ/fLbcLem5RiWBf8VbfM.iO', 'USER')
ON CONFLICT (email) DO NOTHING;