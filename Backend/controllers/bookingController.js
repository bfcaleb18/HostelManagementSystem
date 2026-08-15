const Booking = require("../models/bookingModel");

const createBooking = (req, res) => {

    const userId = req.user.id;

    const {
        room_id,
        booking_date
    } = req.body;


    if (!room_id || !booking_date) {

        return res.status(400).json({
            message: "Room ID and booking date are required"
        });

    }


    Booking.getRoomById(room_id, (err, rooms) => {

        if (err) {

            return res.status(500).json({
                message: err.message
            });

        }


        if (rooms.length === 0) {

            return res.status(404).json({
                message: "Room not found"
            });

        }


        const room = rooms[0];


        if (room.status === "Occupied") {

            return res.status(409).json({
                message: "This room is currently occupied"
            });

        }


        Booking.checkExistingBooking(
            userId,
            room_id,
            (err, existingBookings) => {

                if (err) {

                    return res.status(500).json({
                        message: err.message
                    });

                }


                if (existingBookings.length > 0) {

                    return res.status(409).json({
                        message: "You already have an active booking for this room"
                    });

                }


                const bookingData = {

                    user_id: userId,

                    room_id: room_id,

                    booking_date: booking_date,

                    status: "Pending"

                };


                Booking.createBooking(
                    bookingData,
                    (err, result) => {

                        if (err) {

                            return res.status(500).json({
                                message: err.message
                            });

                        }


                        res.status(201).json({

                            message: "Booking created successfully",

                            bookingId: result.insertId,

                            status: "Pending"

                        });

                    }
                );

            }
        );

    });

};

const getBookings = (req, res) => {

    const userId = req.user.id;

    const isAdmin = req.user.role === "admin";


    if (isAdmin) {

        Booking.getAllBookings((err, results) => {

            if (err) {

                return res.status(500).json({
                    message: err.message
                });

            }


            return res.status(200).json({
                bookings: results
            });

        });

    } else {

        Booking.getBookingsByUser(
            userId,
            (err, results) => {

                if (err) {

                    return res.status(500).json({
                        message: err.message
                    });

                }


                res.status(200).json({
                    bookings: results
                });

            }
        );

    }

};

const getBookingById = (req, res) => {

    const bookingId = req.params.id;

    const userId = req.user.id;

    const isAdmin = req.user.role === "admin";


    Booking.getBookingById(
        bookingId,
        (err, results) => {

            if (err) {

                return res.status(500).json({
                    message: err.message
                });

            }


            if (results.length === 0) {

                return res.status(404).json({
                    message: "Booking not found"
                });

            }


            const booking = results[0];


            if (!isAdmin && booking.user_id !== userId) {

                return res.status(403).json({
                    message: "You are not authorized to view this booking"
                });

            }


            res.status(200).json({
                booking: booking
            });

        }
    );

};

const approveBooking = (req, res) => {

    const bookingId = req.params.id;


    Booking.getBookingById(
        bookingId,
        (err, results) => {

            if (err) {

                return res.status(500).json({
                    message: err.message
                });

            }


            if (results.length === 0) {

                return res.status(404).json({
                    message: "Booking not found"
                });

            }


            const booking = results[0];


            if (booking.status !== "Pending") {

                return res.status(400).json({
                    message: "Only pending bookings can be approved"
                });

            }


            Booking.checkApprovedBookingForRoom(
                booking.room_id,
                (err, approvedBookings) => {

                    if (err) {

                        return res.status(500).json({
                            message: err.message
                        });

                    }


                    if (approvedBookings.length > 0) {

                        return res.status(409).json({
                            message: "This room already has an approved booking"
                        });

                    }


                    Booking.approveBooking(
                        bookingId,
                        (err, result) => {

                            if (err) {

                                return res.status(500).json({
                                    message: err.message
                                });

                            }


                            if (result.affectedRows === 0) {

                                return res.status(400).json({
                                    message: "Booking could not be approved"
                                });

                            }


                            Booking.updateRoomStatus(
                                booking.room_id,
                                "Occupied",
                                (err) => {

                                    if (err) {

                                        return res.status(500).json({
                                            message: err.message
                                        });

                                    }


                                    res.status(200).json({

                                        message: "Booking approved successfully"

                                    });

                                }
                            );

                        }
                    );

                }
            );

        }
    );

};

const cancelBooking = (req, res) => {

    const bookingId = req.params.id;

    const userId = req.user.id;

    const isAdmin = req.user.role === "admin";


    Booking.getBookingById(
        bookingId,
        (err, results) => {

            if (err) {

                return res.status(500).json({
                    message: err.message
                });

            }


            if (results.length === 0) {

                return res.status(404).json({
                    message: "Booking not found"
                });

            }


            const booking = results[0];


            if (!isAdmin && booking.user_id !== userId) {

                return res.status(403).json({
                    message: "You are not authorized to cancel this booking"
                });

            }


            if (booking.status === "Cancelled") {

                return res.status(400).json({
                    message: "Booking is already cancelled"
                });

            }


            Booking.cancelBooking(
                bookingId,
                (err, result) => {

                    if (err) {

                        return res.status(500).json({
                            message: err.message
                        });

                    }


                    if (result.affectedRows === 0) {

                        return res.status(400).json({
                            message: "Booking could not be cancelled"
                        });

                    }


                    if (booking.status === "Approved") {

                        Booking.updateRoomStatus(
                            booking.room_id,
                            "Available",
                            (err) => {

                                if (err) {

                                    return res.status(500).json({
                                        message: err.message
                                    });

                                }


                                res.status(200).json({

                                    message: "Booking cancelled and room is now available"

                                });

                            }
                        );

                    } else {

                        res.status(200).json({

                            message: "Booking cancelled successfully"

                        });

                    }

                }
            );

        }
    );

};

const deleteBooking = (req, res) => {

    const bookingId = req.params.id;


    Booking.getBookingById(
        bookingId,
        (err, results) => {

            if (err) {

                return res.status(500).json({
                    message: err.message
                });

            }


            if (results.length === 0) {

                return res.status(404).json({
                    message: "Booking not found"
                });

            }


            const booking = results[0];


            if (booking.status === "Approved") {

                return res.status(400).json({
                    message: "Approved bookings should be cancelled instead of deleted"
                });

            }


            Booking.deleteBooking(
                bookingId,
                (err, result) => {

                    if (err) {

                        return res.status(500).json({
                            message: err.message
                        });

                    }


                    if (result.affectedRows === 0) {

                        return res.status(404).json({
                            message: "Booking not found"
                        });

                    }


                    res.status(200).json({

                        message: "Booking deleted successfully"

                    });

                }
            );

        }
    );

};

module.exports = {

    createBooking,

    getBookings,

    getBookingById,

    approveBooking,

    cancelBooking,

    deleteBooking

};