const token = localStorage.getItem("token");

const storedUser = localStorage.getItem("user");


if (!token || !storedUser) {

    window.location.href = "login.html";

}


const bookingsContainer =
    document.getElementById("bookingsContainer");


const bookingsMessage =
    document.getElementById("bookingsMessage");


const logoutButton =
    document.getElementById("logoutButton");


if (logoutButton) {

    logoutButton.addEventListener("click", () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        window.location.href = "login.html";

    });

}


/*
    Load student's bookings
*/

async function loadBookings() {

    try {

        bookingsMessage.textContent =
            "Loading bookings...";


        const response = await fetch(
            `${API_BASE_URL}/bookings`,
            {

                method: "GET",

                headers: {

                    Authorization:
                        `Bearer ${token}`

                }

            }
        );


        const data =
            await response.json();


        console.log(
            "Bookings response:",
            data
        );


        if (!response.ok) {

            bookingsMessage.textContent =
                data.message ||
                "Unable to load bookings.";

            return;

        }


        const bookings =
            data.bookings || data;


        bookingsContainer.innerHTML = "";


        if (
            !Array.isArray(bookings) ||
            bookings.length === 0
        ) {

            bookingsMessage.textContent =
                "You have no bookings yet.";

            return;

        }


        bookingsMessage.textContent = "";


        bookings.forEach((booking) => {

            const bookingCard =
                document.createElement("div");


            bookingCard.className =
                "booking-card";


            const status =
                booking.status || "Pending";


            let statusClass =
                "status-pending";


            if (status === "Approved") {

                statusClass =
                    "status-approved";

            }


            if (status === "Cancelled") {

                statusClass =
                    "status-cancelled";

            }


            if (status === "Rejected") {

                statusClass =
                    "status-rejected";

            }


            bookingCard.innerHTML = `

                <h2>
                    Booking #${booking.id}
                </h2>


                <div class="booking-details">

                    <p>
                        <strong>Room:</strong>
                        ${
                            booking.room_number ||
                            booking.room_id ||
                            "N/A"
                        }
                    </p>


                    <p>
                        <strong>Booking Date:</strong>
                        ${
                            booking.booking_date ||
                            "N/A"
                        }
                    </p>


                    <p>
                        <strong>Status:</strong>

                        <span
                            class="booking-status ${statusClass}"
                        >
                            ${status}
                        </span>

                    </p>


                    ${
                        status === "Pending"

                        ?

                        `
                        <button
                            type="button"
                            class="cancel-booking-btn"
                            data-booking-id="${booking.id}"
                        >
                            Cancel Booking
                        </button>
                        `

                        :

                        ""
                    }


                    <p
                        id="booking-action-message-${booking.id}"
                        class="booking-action-message"
                    ></p>

                </div>

            `;


            bookingsContainer.appendChild(
                bookingCard
            );

        });


        attachCancelButtons();

    }

    catch (error) {

        console.error(
            "Booking loading error:",
            error
        );


        bookingsMessage.textContent =
            "Unable to connect to the server.";

    }

}


/*
    Attach cancel buttons
*/

function attachCancelButtons() {

    const buttons =
        document.querySelectorAll(
            ".cancel-booking-btn"
        );


    buttons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                const bookingId =
                    button.dataset.bookingId;


                showCancelConfirmation(
                    bookingId,
                    button
                );

            }
        );

    });

}


/*
    Show cancellation confirmation
*/

function showCancelConfirmation(
    bookingId,
    button
) {

    const existingModal =
        document.getElementById(
            "cancelBookingModal"
        );


    if (existingModal) {

        existingModal.remove();

    }


    const modal =
        document.createElement("div");


    modal.id =
        "cancelBookingModal";


    modal.className =
        "booking-modal";


    modal.innerHTML = `

        <div class="booking-modal-content">

            <h2>
                Cancel Booking
            </h2>


            <p>
                Are you sure you want to cancel
                this booking?
            </p>


            <div class="booking-modal-buttons">

                <button
                    type="button"
                    id="cancelCancellation"
                    class="cancel-btn"
                >
                    No, Keep Booking
                </button>


                <button
                    type="button"
                    id="confirmCancellation"
                    class="danger-btn"
                >
                    Yes, Cancel Booking
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(modal);


    const cancelButton =
        document.getElementById(
            "cancelCancellation"
        );


    const confirmButton =
        document.getElementById(
            "confirmCancellation"
        );


    /*
        Keep the booking
    */

    cancelButton.addEventListener(
        "click",
        () => {

            modal.remove();

        }
    );


    /*
        Confirm cancellation
    */

    confirmButton.addEventListener(
        "click",
        async () => {

            modal.remove();


            await cancelBooking(
                bookingId,
                button
            );

        }
    );

}

/*
    Cancel booking
*/

async function cancelBooking(
    bookingId,
    button
) {

    const message =
        document.getElementById(
            `booking-action-message-${bookingId}`
        );


    button.disabled = true;

    button.textContent =
        "Cancelling...";


    try {

        const response = await fetch(
            `${API_BASE_URL}/bookings/${bookingId}/cancel`,
            {

                method: "PUT",

                headers: {

                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${token}`

                }

            }
        );


        const data =
            await response.json();


        console.log(
            "Cancel response:",
            data
        );


        if (!response.ok) {

            message.textContent =
                data.message ||
                "Unable to cancel booking.";

            button.disabled = false;

            button.textContent =
                "Cancel Booking";

            return;

        }


        message.textContent =
            "Booking cancelled successfully.";


        button.remove();


        /*
            Reload the bookings so the
            status changes immediately.
        */

        setTimeout(() => {

            loadBookings();

        }, 500);

    }

    catch (error) {

        console.error(
            "Cancellation error:",
            error
        );


        message.textContent =
            "Unable to connect to the server.";

        button.disabled = false;

        button.textContent =
            "Cancel Booking";

    }

}


loadBookings();