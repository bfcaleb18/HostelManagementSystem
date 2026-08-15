const db = require("../config/db");


const createBooking = (bookingData, callback) => {

    const sql = `
        INSERT INTO bookings
        (user_id, room_id, booking_date, status)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            bookingData.user_id,
            bookingData.room_id,
            bookingData.booking_date,
            bookingData.status
        ],
        callback
    );

};


const getAllBookings = (callback) => {

    const sql = `
        SELECT
            bookings.id,
            bookings.booking_date,
            bookings.status,

            users.full_name,
            users.student_id,
            users.email,

            rooms.room_number,
            rooms.block_name,
            rooms.capacity,
            rooms.price

        FROM bookings

        INNER JOIN users
            ON bookings.user_id = users.id

        INNER JOIN rooms
            ON bookings.room_id = rooms.id

        ORDER BY bookings.id DESC
    `;

    db.query(sql, callback);

};


const getBookingsByUser = (userId, callback) => {

    const sql = `
        SELECT
            bookings.id,
            bookings.booking_date,
            bookings.status,

            rooms.room_number,
            rooms.block_name,
            rooms.capacity,
            rooms.price

        FROM bookings

        INNER JOIN rooms
            ON bookings.room_id = rooms.id

        WHERE bookings.user_id = ?

        ORDER BY bookings.id DESC
    `;

    db.query(sql, [userId], callback);

};


const getBookingById = (id, callback) => {

    const sql = `
        SELECT
            bookings.id,
            bookings.user_id,
            bookings.room_id,
            bookings.booking_date,
            bookings.status,

            users.full_name,
            users.student_id,
            users.email,

            rooms.room_number,
            rooms.block_name,
            rooms.capacity,
            rooms.price

        FROM bookings

        INNER JOIN users
            ON bookings.user_id = users.id

        INNER JOIN rooms
            ON bookings.room_id = rooms.id

        WHERE bookings.id = ?
    `;

    db.query(sql, [id], callback);

};


const getRoomById = (roomId, callback) => {

    const sql = `
        SELECT *
        FROM rooms
        WHERE id = ?
    `;

    db.query(sql, [roomId], callback);

};


const checkExistingBooking = (userId, roomId, callback) => {

    const sql = `
        SELECT *
        FROM bookings
        WHERE user_id = ?
        AND room_id = ?
        AND status IN ('Pending', 'Approved')
    `;

    db.query(
        sql,
        [userId, roomId],
        callback
    );

};


const checkApprovedBookingForRoom = (roomId, callback) => {

    const sql = `
        SELECT *
        FROM bookings
        WHERE room_id = ?
        AND status = 'Approved'
    `;

    db.query(
        sql,
        [roomId],
        callback
    );

};


const approveBooking = (bookingId, callback) => {

    const sql = `
        UPDATE bookings
        SET status = 'Approved'
        WHERE id = ?
        AND status = 'Pending'
    `;

    db.query(
        sql,
        [bookingId],
        callback
    );

};


const cancelBooking = (bookingId, callback) => {

    const sql = `
        UPDATE bookings
        SET status = 'Cancelled'
        WHERE id = ?
        AND status != 'Cancelled'
    `;

    db.query(
        sql,
        [bookingId],
        callback
    );

};


const deleteBooking = (bookingId, callback) => {

    const sql = `
        DELETE FROM bookings
        WHERE id = ?
    `;

    db.query(
        sql,
        [bookingId],
        callback
    );

};


const updateRoomStatus = (roomId, status, callback) => {

    const sql = `
        UPDATE rooms
        SET status = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [status, roomId],
        callback
    );

};


module.exports = {

    createBooking,

    getAllBookings,

    getBookingsByUser,

    getBookingById,

    getRoomById,

    checkExistingBooking,

    checkApprovedBookingForRoom,

    approveBooking,

    cancelBooking,

    deleteBooking,

    updateRoomStatus

};