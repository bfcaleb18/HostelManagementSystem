const express = require("express");

const router = express.Router();


const {
    getAllRooms,
    getRoomById,
    createRoom,
    updateRoom,
    deleteRoom
} = require("../controllers/roomController");


const authenticateToken = require("../middleware/authMiddleware");

const requireAdmin = require("../middleware/roleMiddleware");


router.get(
    "/",
    authenticateToken,
    getAllRooms
);


router.get(
    "/:id",
    authenticateToken,
    getRoomById
);


router.post(
    "/",
    authenticateToken,
    requireAdmin,
    createRoom
);


router.put(
    "/:id",
    authenticateToken,
    requireAdmin,
    updateRoom
);


router.delete(
    "/:id",
    authenticateToken,
    requireAdmin,
    deleteRoom
);


module.exports = router;