const token = localStorage.getItem("token");

const storedUser = localStorage.getItem("user");


if (!token || !storedUser) {

    window.location.href = "login.html";

}


const roomsContainer =
    document.getElementById("roomsContainer");

const roomsMessage =
    document.getElementById("roomsMessage");

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
    Load all rooms
*/

async function loadRooms() {

    try {

        roomsMessage.textContent =
            "Loading rooms...";


        const response = await fetch(
            `${API_BASE_URL}/rooms`,
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


        console.log("Rooms response:", data);


        if (!response.ok) {

            roomsMessage.textContent =
                data.message ||
                "Unable to load rooms.";

            return;

        }


        const rooms =
            data.rooms || data;


        roomsContainer.innerHTML = "";


        if (!Array.isArray(rooms) || rooms.length === 0) {

            roomsMessage.textContent =
                "No rooms are currently available.";

            return;

        }


        roomsMessage.textContent = "";


        rooms.forEach((room) => {

            const roomCard =
                document.createElement("div");


            roomCard.className =
                "room-card";


            roomCard.innerHTML = `

                <h2>
                    Room ${room.room_number}
                </h2>

                <p>
                    <strong>Block:</strong>
                    ${room.block || "N/A"}
                </p>

                <p>
                    <strong>Type:</strong>
                    ${room.room_type || "N/A"}
                </p>

                <p>
                    <strong>Capacity:</strong>
                    ${room.capacity || "N/A"}
                </p>

                <p>
                    <strong>Price:</strong>
                    ${room.price || "N/A"}
                </p>

                <p>
                    <strong>Status:</strong>
                    ${room.status || "N/A"}
                </p>

                ${
                    room.status === "Available"

                    ?

                    `
                    <button
                        type="button"
                        class="btn book-btn"
                        data-room-id="${room.id}"
                    >
                        Book Room
                    </button>
                    `

                    :

                    `
                    <button
                        type="button"
                        class="btn disabled-btn"
                        disabled
                    >
                        Not Available
                    </button>
                    `
                }

                <p
                    class="booking-message"
                    id="booking-message-${room.id}"
                ></p>

            `;


            roomsContainer.appendChild(roomCard);

        });


        attachBookingButtons();

    }

    catch (error) {

        console.error(
            "Room loading error:",
            error
        );


        roomsMessage.textContent =
            "Unable to connect to the server.";

    }

}


/*
    Attach click events to Book Room buttons
*/

function attachBookingButtons() {

    const buttons =
        document.querySelectorAll(".book-btn");


    buttons.forEach((button) => {

        button.addEventListener("click", () => {

            const roomId =
                button.dataset.roomId;


            console.log(
                "Book Room clicked. Room ID:",
                roomId
            );


            showBookingConfirmation(
                roomId,
                button
            );

        });

    });

}


/*
    Show confirmation dialog
*/

function showBookingConfirmation(
    roomId,
    button
) {

    const existingModal =
        document.getElementById(
            "bookingModal"
        );


    if (existingModal) {

        existingModal.remove();

    }


    const modal =
        document.createElement("div");


    modal.id =
        "bookingModal";


    modal.className =
        "booking-modal";


    modal.innerHTML = `

        <div class="booking-modal-content">

            <h2>
                Confirm Booking
            </h2>


            <p>
                Select the date you want to book
                this room.
            </p>


            <label
                for="bookingDate"
                class="booking-date-label"
            >
                Booking Date
            </label>


            <input
                type="date"
                id="bookingDate"
                class="booking-date-input"
            >


            <p
                id="bookingDateError"
                class="booking-date-error"
            ></p>


            <div class="booking-modal-buttons">

                <button
                    type="button"
                    id="cancelBooking"
                    class="cancel-btn"
                >
                    Cancel
                </button>


                <button
                    type="button"
                    id="confirmBooking"
                    class="btn"
                >
                    Confirm Booking
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(modal);


    const dateInput =
        document.getElementById(
            "bookingDate"
        );


    const dateError =
        document.getElementById(
            "bookingDateError"
        );


    const cancelButton =
        document.getElementById(
            "cancelBooking"
        );


    const confirmButton =
        document.getElementById(
            "confirmBooking"
        );


    /*
        Prevent the user from selecting
        a date in the past.
    */

    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    dateInput.min = today;


    /*
        Cancel booking
    */

    cancelButton.addEventListener(
        "click",
        () => {

            modal.remove();

        }
    );


    /*
        Confirm booking
    */

    confirmButton.addEventListener(
        "click",
        async () => {

            const bookingDate =
                dateInput.value;


            /*
                Make sure a date was selected.
            */

            if (!bookingDate) {

                dateError.textContent =
                    "Please select a booking date.";

                return;

            }


            /*
                Close confirmation modal.
            */

            modal.remove();


            /*
                Send room ID and booking date
                to the backend.
            */

            await bookRoom(
                roomId,
                bookingDate,
                button
            );

        }
    );

}

/*
    Send booking request to backend
*/

async function bookRoom(
    roomId,
    bookingDate,
    button
) {
    const message =
        document.getElementById(
            `booking-message-${roomId}`
        );


    button.disabled = true;

    button.textContent =
        "Booking...";


    try {

        console.log(
            "Sending booking request for room:",
            roomId
        );


        const response = await fetch(
            `${API_BASE_URL}/bookings`,
            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${token}`

                },

                body: JSON.stringify({

                  room_id: roomId,

                  booking_date: bookingDate

             })
            }
        );


        const data =
            await response.json();


        console.log(
            "Booking response:",
            data
        );


        if (!response.ok) {

            message.textContent =
                data.message ||
                "Booking failed.";

            button.disabled = false;

            button.textContent =
                "Book Room";

            return;

        }


        message.textContent =
            "Booking submitted successfully.";


        button.textContent =
            "Booking Submitted";


        button.disabled = true;

    }

    catch (error) {

        console.error(
            "Booking error:",
            error
        );


        message.textContent =
            "Unable to connect to the server.";


        button.disabled = false;

        button.textContent =
            "Book Room";

    }

}


loadRooms();