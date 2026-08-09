const Room = require("../models/roomModel");

const getAllRooms = (req, res) => {

    Room.getAllRooms((err, results) => {

        if (err) {

            return res.status(500).json({
                message: err.message
            });

        }

        res.status(200).json({
            rooms: results
        });

    });

};

const getRoomById = (req, res) => {

    const { id } = req.params;

    Room.getRoomById(id, (err, results) => {

        if (err) {

            return res.status(500).json({
                message: err.message
            });

        }

        if (results.length === 0) {

            return res.status(404).json({
                message: "Room not found"
            });

        }

        res.status(200).json({
            room: results[0]
        });

    });

};

const createRoom = (req, res) => {

    const {
        room_number,
        block_name,
        capacity,
        price,
        status
    } = req.body;


    if (
        !room_number ||
        !block_name ||
        !capacity ||
        !price
    ) {

        return res.status(400).json({
            message: "Please provide room number, block, capacity and price"
        });

    }


    const roomData = {

        room_number,

        block_name,

        capacity,

        price,

        status: status || "Available"

    };


    Room.createRoom(roomData, (err, result) => {

        if (err) {

            if (err.code === "ER_DUP_ENTRY") {

                return res.status(409).json({
                    message: "Room number already exists"
                });

            }

            return res.status(500).json({
                message: err.message
            });

        }


        res.status(201).json({

            message: "Room created successfully",

            roomId: result.insertId

        });

    });

};

const updateRoom = (req, res) => {

    const { id } = req.params;

    const {
        room_number,
        block_name,
        capacity,
        price,
        status
    } = req.body;


    if (
        !room_number ||
        !block_name ||
        !capacity ||
        !price ||
        !status
    ) {

        return res.status(400).json({
            message: "Please provide all room details"
        });

    }


    const roomData = {

        room_number,

        block_name,

        capacity,

        price,

        status

    };


    Room.updateRoom(id, roomData, (err, result) => {

        if (err) {

            if (err.code === "ER_DUP_ENTRY") {

                return res.status(409).json({
                    message: "Room number already exists"
                });

            }

            return res.status(500).json({
                message: err.message
            });

        }


        if (result.affectedRows === 0) {

            return res.status(404).json({
                message: "Room not found"
            });

        }


        res.status(200).json({

            message: "Room updated successfully"

        });

    });

};

const deleteRoom = (req, res) => {

    const { id } = req.params;


    Room.deleteRoom(id, (err, result) => {

        if (err) {

            return res.status(500).json({
                message: err.message
            });

        }


        if (result.affectedRows === 0) {

            return res.status(404).json({
                message: "Room not found"
            });

        }


        res.status(200).json({

            message: "Room deleted successfully"

        });

    });

};

module.exports = {
    getAllRooms,
    getRoomById,
    createRoom,
    updateRoom,
    deleteRoom
};