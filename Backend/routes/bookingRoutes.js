const express = require("express");

const router = express.Router();


const {
    createBooking,
    getBookings,
    getBookingById,
    approveBooking,
    cancelBooking,
    deleteBooking
} = require("../controllers/bookingController");


const authenticateToken = require("../middleware/authMiddleware");

const requireAdmin = require("../middleware/roleMiddleware");


router.post(
    "/",
    authenticateToken,
    createBooking
);


router.get(
    "/",
    authenticateToken,
    getBookings
);


router.get(
    "/:id",
    authenticateToken,
    getBookingById
);


router.put(
    "/:id/approve",
    authenticateToken,
    requireAdmin,
    approveBooking
);


router.put(
    "/:id/cancel",
    authenticateToken,
    cancelBooking
);


router.delete(
    "/:id",
    authenticateToken,
    requireAdmin,
    deleteBooking
);


module.exports = router;