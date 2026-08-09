const db = require("../config/db");

const getAllRooms = (callback) => {

    const sql = "SELECT * FROM rooms";

    db.query(sql, callback);

};


const getRoomById = (id, callback) => {

    const sql = "SELECT * FROM rooms WHERE id = ?";

    db.query(sql, [id], callback);

};


const createRoom = (roomData, callback) => {

    const sql = `
        INSERT INTO rooms
        (room_number, block_name, capacity, price, status)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            roomData.room_number,
            roomData.block_name,
            roomData.capacity,
            roomData.price,
            roomData.status
        ],
        callback
    );

};


const updateRoom = (id, roomData, callback) => {

    const sql = `
        UPDATE rooms
        SET
            room_number = ?,
            block_name = ?,
            capacity = ?,
            price = ?,
            status = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            roomData.room_number,
            roomData.block_name,
            roomData.capacity,
            roomData.price,
            roomData.status,
            id
        ],
        callback
    );

};


const deleteRoom = (id, callback) => {

    const sql = "DELETE FROM rooms WHERE id = ?";

    db.query(sql, [id], callback);

};


module.exports = {
    getAllRooms,
    getRoomById,
    createRoom,
    updateRoom,
    deleteRoom
};