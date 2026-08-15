CREATE DATABASE hostel_management;
USE hostel_management;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    student_id VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    role ENUM('student','admin') DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_number VARCHAR(20) NOT NULL,
    block_name VARCHAR(10),
    capacity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    status ENUM('Available','Occupied') DEFAULT 'Available'
);

CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    room_id INT NOT NULL,
    booking_date DATE,
    status ENUM('Pending','Approved','Cancelled') DEFAULT 'Pending',

    FOREIGN KEY (user_id)
        REFERENCES users(id),

    FOREIGN KEY (room_id)
        REFERENCES rooms(id)
);

CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    receipt_url VARCHAR(255),
    payment_status ENUM('Pending','Approved','Rejected') DEFAULT 'Pending',
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (booking_id)
        REFERENCES bookings(id)
);

SHOW TABLES;

DESCRIBE users;
DESCRIBE rooms;
DESCRIBE bookings;
DESCRIBE payments;