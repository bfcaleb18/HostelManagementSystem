const token = localStorage.getItem("token");

const storedUser =
    localStorage.getItem("user");


/*
    Make sure the user is logged in.
*/

if (!token || !storedUser) {

    window.location.href = "login.html";

}


/*
    Convert stored user information
    from JSON into a JavaScript object.
*/

const user =
    JSON.parse(storedUser);


/*
    Check administrator role.
*/

if (user.role !== "admin") {

    alert(
        "Access denied. Administrator privileges required."
    );

    window.location.href =
        "dashboard.html";

}

const adminMessage =
    document.getElementById("adminMessage");


const roomsAdminContainer =
    document.getElementById(
        "roomsAdminContainer"
    );


const bookingsAdminContainer =
    document.getElementById(
        "bookingsAdminContainer"
    );


const addRoomButton =
    document.getElementById(
        "addRoomButton"
    );


const logoutButton =
    document.getElementById(
        "logoutButton"
    );

    if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        () => {

            localStorage.removeItem("token");

            localStorage.removeItem("user");

            window.location.href =
                "login.html";

        }
    );

}

async function loadAdminRooms() {

    try {

        roomsAdminContainer.innerHTML =
            "<p>Loading rooms...</p>";


        const response =
            await fetch(
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


        console.log(
            "Admin rooms:",
            data
        );


        if (!response.ok) {

            roomsAdminContainer.innerHTML =
                `<p>
                    ${
                        data.message ||
                        "Unable to load rooms."
                    }
                </p>`;

            return;

        }


        const rooms =
            data.rooms || data;


        if (
            !Array.isArray(rooms) ||
            rooms.length === 0
        ) {

            roomsAdminContainer.innerHTML =
                "<p>No rooms found.</p>";

            return;

        }


        roomsAdminContainer.innerHTML = "";


        rooms.forEach((room) => {

            const row =
                document.createElement("div");


            row.className =
                "admin-room-row";


            row.innerHTML = `

                <div>

                    <strong>
                        Room ${room.room_number}
                    </strong>

                    <p>
                        Capacity:
                        ${room.capacity || "N/A"}
                    </p>

                    <p>
                        Price:
                        ${room.price || "N/A"}
                    </p>

                    <p>
                        Status:
                        ${room.status || "N/A"}
                    </p>

                </div>


                <div class="admin-actions">

                    <button
                        type="button"
                        class="edit-room-btn"
                        data-room-id="${room.id}"
                    >
                        Edit
                    </button>


                    <button
                        type="button"
                        class="delete-room-btn"
                        data-room-id="${room.id}"
                    >
                        Delete
                    </button>

                </div>

            `;


            roomsAdminContainer.appendChild(
                row
            );

        });


        attachRoomActions();

    }

    catch (error) {

        console.error(
            "Admin room error:",
            error
        );


        roomsAdminContainer.innerHTML =
            "<p>Unable to connect to the server.</p>";

    }

}async function loadAdminBookings() {

    try {

        bookingsAdminContainer.innerHTML =
            "<p>Loading bookings...</p>";


        const response =
            await fetch(
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
            "Admin bookings:",
            data
        );


        if (!response.ok) {

            bookingsAdminContainer.innerHTML =
                `<p>
                    ${
                        data.message ||
                        "Unable to load bookings."
                    }
                </p>`;

            return;

        }


        const bookings =
            data.bookings || data;


        if (
            !Array.isArray(bookings) ||
            bookings.length === 0
        ) {

            bookingsAdminContainer.innerHTML =
                "<p>No bookings found.</p>";

            return;

        }


        bookingsAdminContainer.innerHTML = "";


        bookings.forEach((booking) => {

            const row =
                document.createElement("div");


            row.className =
                "admin-booking-row";


            const status =
                booking.status || "Pending";


            row.innerHTML = `

                <div>

                    <strong>
                        Booking #${booking.id}
                    </strong>


                    <p>
                        Student:
                        ${
                            booking.full_name ||
                            booking.student_name ||
                            "N/A"
                        }
                    </p>


                    <p>
                        Email:
                        ${
                            booking.email ||
                            "N/A"
                        }
                    </p>


                    <p>
                        Room:
                        ${
                            booking.room_number ||
                            booking.room_id ||
                            "N/A"
                        }
                    </p>


                    <p>
                        Booking Date:
                        ${
                            booking.booking_date ||
                            "N/A"
                        }
                    </p>


                    <p>
                        Status:
                        <strong>
                            ${status}
                        </strong>
                    </p>

                </div>


                ${
                    status === "Pending"

                    ?

                    `
                    <div class="admin-actions">

                        <button
                            type="button"
                            class="approve-booking-btn"
                            data-booking-id="${booking.id}"
                        >
                            Approve
                        </button>


                        <button
                            type="button"
                            class="reject-booking-btn"
                            data-booking-id="${booking.id}"
                        >
                            Reject
                        </button>

                    </div>
                    `

                    :

                    ""
                }

            `;


            bookingsAdminContainer.appendChild(
                row
            );

        });


        attachBookingActions();

    }

    catch (error) {

        console.error(
            "Admin booking error:",
            error
        );


        bookingsAdminContainer.innerHTML =
            "<p>Unable to connect to the server.</p>";

    }

}

function showAddRoomModal() {

    const existingModal =
        document.getElementById("roomModal");

    if (existingModal) {
        existingModal.remove();
    }

    const modal =
        document.createElement("div");

    modal.id = "roomModal";

    modal.className = "booking-modal";

    modal.innerHTML = `

        <div class="booking-modal-content">

            <h2>
                Add Hostel Room
            </h2>


            <label>
                Room Number
            </label>

            <input
                type="text"
                id="roomNumberInput"
                class="booking-date-input"
                placeholder="e.g. A103"
            >


            <label>
                Block
            </label>

            <input
                type="text"
                id="roomBlockInput"
                class="booking-date-input"
                placeholder="e.g. A"
            >


            <label>
                Capacity
            </label>

            <input
                type="number"
                id="roomCapacityInput"
                class="booking-date-input"
                placeholder="e.g. 2"
                min="1"
            >


            <label>
                Price
            </label>

            <input
                type="number"
                id="roomPriceInput"
                class="booking-date-input"
                placeholder="e.g. 2500"
                min="0"
            >


            <label>
                Status
            </label>

            <select
                id="roomStatusInput"
                class="booking-date-input"
            >

                <option value="Available">
                    Available
                </option>

                <option value="Occupied">
                    Occupied
                </option>

                <option value="Maintenance">
                    Maintenance
                </option>

            </select>


            <p
                id="roomModalError"
                class="booking-date-error"
            ></p>


            <div class="booking-modal-buttons">

                <button
                    type="button"
                    id="cancelRoomModal"
                    class="cancel-btn"
                >
                    Cancel
                </button>


                <button
                    type="button"
                    id="saveRoomButton"
                    class="btn"
                >
                    Save Room
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(modal);


    document
        .getElementById("cancelRoomModal")
        .addEventListener(
            "click",
            () => {

                modal.remove();

            }
        );


    document
        .getElementById("saveRoomButton")
        .addEventListener(
            "click",
            () => {

                createRoom();

            }
        );

}

if (addRoomButton) {

    addRoomButton.addEventListener(
        "click",
        () => {

            showAddRoomModal();

        }
    );

}

async function createRoom() {

    const roomNumberInput =
        document.getElementById(
            "roomNumberInput"
        );

    const blockInput =
        document.getElementById(
            "roomBlockInput"
        );

    const capacityInput =
        document.getElementById(
            "roomCapacityInput"
        );

    const priceInput =
        document.getElementById(
            "roomPriceInput"
        );

    const statusInput =
        document.getElementById(
            "roomStatusInput"
        );

    const error =
        document.getElementById(
            "roomModalError"
        );


    const roomNumber =
        roomNumberInput.value.trim();

    const block =
        blockInput.value.trim();

    const capacity =
        capacityInput.value;

    const price =
        priceInput.value;

    const status =
        statusInput.value;


    console.log("Room Number:", roomNumber);
    console.log("Block:", block);
    console.log("Capacity:", capacity);
    console.log("Price:", price);
    console.log("Status:", status);


    if (
        !roomNumber ||
        !block ||
        !capacity ||
        !price
    ) {

        error.textContent =
            "Please provide room number, block, capacity and price.";

        return;

    }


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/rooms`,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`

                    },

                    body: JSON.stringify({

                        room_number:
                            roomNumber,

                        block_name:
                            block,

                        capacity:
                            Number(capacity),

                        price:
                            Number(price),

                        status:
                            status

                    })

                }
            );


        const data =
            await response.json();


        console.log(
            "Create room response:",
            data
        );


        if (!response.ok) {

            error.textContent =
                data.message ||
                "Unable to create room.";

            return;

        }


        document
            .getElementById("roomModal")
            .remove();


        adminMessage.textContent =
            "Room created successfully.";


        loadAdminRooms();

    }

    catch (error) {

        console.error(
            "Create room error:",
            error
        );

        const modalError =
            document.getElementById(
                "roomModalError"
            );

        if (modalError) {

            modalError.textContent =
                "Unable to connect to the server.";

        }

    }

}

async function showEditRoomModal(roomId) {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/rooms/${roomId}`,
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


        if (!response.ok) {

            adminMessage.textContent =
                data.message ||
                "Unable to load room.";

            return;

        }


        const room =
            data.room || data;


        const modal =
            document.createElement("div");


        modal.id =
            "editRoomModal";


        modal.className =
            "booking-modal";


        modal.innerHTML = `

            <div class="booking-modal-content">

                <h2>
                    Edit Room
                </h2>


                <label>
                    Room Number
                </label>

                <input
                    type="text"
                    id="editRoomNumber"
                    class="booking-date-input"
                    value="${room.room_number || ""}"
                >

                <label>
                    Block
                </label>

                <input
                    type="text"
                    id="editRoomBlock"
                    class="booking-date-input"
                    placeholder="e.g. A"
                    value="${room.block_name || ""}"
                >

                <label>
                    Capacity
                </label>

                <input
                    type="number"
                    id="editRoomCapacity"
                    class="booking-date-input"
                    value="${room.capacity || ""}"
                    min="1"
                >


                <label>
                    Price
                </label>

                <input
                    type="number"
                    id="editRoomPrice"
                    class="booking-date-input"
                    value="${room.price || ""}"
                    min="0"
                >


                <label>
                    Status
                </label>

                <select
                    id="editRoomStatus"
                    class="booking-date-input"
                >

                    <option
                        value="Available"
                        ${
                            room.status === "Available"
                            ? "selected"
                            : ""
                        }
                    >
                        Available
                    </option>


                    <option
                        value="Occupied"
                        ${
                            room.status === "Occupied"
                            ? "selected"
                            : ""
                        }
                    >
                        Occupied
                    </option>


                    <option
                        value="Maintenance"
                        ${
                            room.status === "Maintenance"
                            ? "selected"
                            : ""
                        }
                    >
                        Maintenance
                    </option>

                </select>


                <p
                    id="editRoomError"
                    class="booking-date-error"
                ></p>


                <div class="booking-modal-buttons">

                    <button
                        type="button"
                        id="cancelEditRoom"
                        class="cancel-btn"
                    >
                        Cancel
                    </button>


                    <button
                        type="button"
                        id="updateRoomButton"
                        class="btn"
                    >
                        Save Changes
                    </button>

                </div>

            </div>

        `;


        document.body.appendChild(modal);


        document
            .getElementById("cancelEditRoom")
            .addEventListener(
                "click",
                () => {

                    modal.remove();

                }
            );


        document
            .getElementById("updateRoomButton")
            .addEventListener(
                "click",
                () => {

                    updateRoom(roomId);

                }
            );

    }

    catch (error) {

        console.error(
            "Load room error:",
            error
        );

        adminMessage.textContent =
            "Unable to connect to the server.";

    }

}

async function updateRoom(roomId) {

    const roomNumber =
        document.getElementById(
            "editRoomNumber"
        ).value.trim();
    
    
        const block =
        document.getElementById(
            "editRoomBlock"
        ).value.trim();    


    const capacity =
        document.getElementById(
            "editRoomCapacity"
        ).value;


    const price =
        document.getElementById(
            "editRoomPrice"
        ).value;


    const status =
        document.getElementById(
            "editRoomStatus"
        ).value;


    const error =
        document.getElementById(
            "editRoomError"
        );


    if (
        !roomNumber ||
        !block ||
        !capacity ||
        !price
    ) {

        error.textContent =
            "Please fill in all required fields.";

        return;

    }


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/rooms/${roomId}`,
                {

                    method: "PUT",

                    headers: {

                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`

                    },

                    body: JSON.stringify({

                        room_number:
                            roomNumber,

                        block_name: 
                            block,

                        capacity:
                            Number(capacity),

                        price:
                            Number(price),

                        status:
                            status

                    })

                }
            );


        const data =
            await response.json();


        console.log(
            "Update room response:",
            data
        );


        if (!response.ok) {

            error.textContent =
                data.message ||
                "Unable to update room.";

            return;

        }


        document
            .getElementById(
                "editRoomModal"
            )
            .remove();


        adminMessage.textContent =
            "Room updated successfully.";


        loadAdminRooms();

    }

    catch (error) {

        console.error(
            "Update room error:",
            error
        );


        error.textContent =
            "Unable to connect to the server.";

    }

}

function attachRoomActions() {

    const editButtons =
        document.querySelectorAll(
            ".edit-room-btn"
        );


    editButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                const roomId =
                    button.dataset.roomId;


                showEditRoomModal(
                    roomId
                );

            }
        );

    });


    const deleteButtons =
        document.querySelectorAll(
            ".delete-room-btn"
        );


    deleteButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                const roomId =
                    button.dataset.roomId;


                showDeleteRoomConfirmation(
                    roomId,
                    button
                );

            }
        );

    });

}

function showDeleteRoomConfirmation(
    roomId,
    button
) {

    const existingModal =
        document.getElementById(
            "deleteRoomModal"
        );


    if (existingModal) {

        existingModal.remove();

    }


    const modal =
        document.createElement("div");


    modal.id =
        "deleteRoomModal";


    modal.className =
        "booking-modal";


    modal.innerHTML = `

        <div class="booking-modal-content">

            <h2>
                Delete Room
            </h2>


            <p>
                Are you sure you want to delete
                this room?
            </p>


            <p>
                This action cannot be undone.
            </p>


            <div class="booking-modal-buttons">

                <button
                    type="button"
                    id="cancelDeleteRoom"
                    class="cancel-btn"
                >
                    Cancel
                </button>


                <button
                    type="button"
                    id="confirmDeleteRoom"
                    class="danger-btn"
                >
                    Delete Room
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(modal);


    document
        .getElementById("cancelDeleteRoom")
        .addEventListener(
            "click",
            () => {

                modal.remove();

            }
        );


    document
        .getElementById("confirmDeleteRoom")
        .addEventListener(
            "click",
            async () => {

                modal.remove();


                await deleteRoom(
                    roomId,
                    button
                );

            }
        );

}

async function deleteRoom(
    roomId,
    button
) {

    button.disabled = true;

    button.textContent =
        "Deleting...";


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/rooms/${roomId}`,
                {

                    method: "DELETE",

                    headers: {

                        Authorization:
                            `Bearer ${token}`

                    }

                }
            );


        const data =
            await response.json();


        console.log(
            "Delete room response:",
            data
        );


        if (!response.ok) {

            adminMessage.textContent =
                data.message ||
                "Unable to delete room.";

            button.disabled = false;

            button.textContent =
                "Delete";

            return;

        }


        adminMessage.textContent =
            "Room deleted successfully.";


        loadAdminRooms();

    }

    catch (error) {

        console.error(
            "Delete room error:",
            error
        );


        adminMessage.textContent =
            "Unable to connect to the server.";

        button.disabled = false;

        button.textContent =
            "Delete";

    }

}

function attachBookingActions() {

    const approveButtons =
        document.querySelectorAll(
            ".approve-booking-btn"
        );


    approveButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                const bookingId =
                    button.dataset.bookingId;


                updateBookingStatus(
                    bookingId,
                    "Approved",
                    button
                );

            }
        );

    });


    const rejectButtons =
        document.querySelectorAll(
            ".reject-booking-btn"
        );


    rejectButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                const bookingId =
                    button.dataset.bookingId;


                updateBookingStatus(
                    bookingId,
                    "Rejected",
                    button
                );

            }
        );

    });

}

async function updateBookingStatus(bookingId, status) {

    try {

        let endpoint = "";

        const normalizedStatus =
            String(status).toLowerCase();


        if (normalizedStatus === "approved") {

            endpoint =
                `${API_BASE_URL}/bookings/${bookingId}/approve`;

        }

        else if (
            normalizedStatus === "rejected" ||
            normalizedStatus === "cancelled"
        ) {

            endpoint =
                `${API_BASE_URL}/bookings/${bookingId}/cancel`;

        }

        else {

            console.error(
                "Unknown booking status:",
                status
            );

            return;

        }


        console.log(
            "Updating booking:",
            bookingId
        );

        console.log(
            "Requested status:",
            status
        );

        console.log(
            "Endpoint:",
            endpoint
        );


        const response = await fetch(
            endpoint,
            {

                method: "PUT",

                headers: {

                    "Content-Type":
                        "application/json",

                    "Authorization":
                        `Bearer ${token}`

                }

            }
        );


        const data =
            await response.json();


        console.log(
            "Booking status response:",
            data
        );


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to update booking status"
            );

        }


        alert(
            data.message ||
            "Booking status updated successfully"
        );


        loadAdminBookings();

    }

    catch (error) {

        console.error(
            "Booking status error:",
            error
        );

        alert(
            error.message ||
            "Unable to update booking status"
        );

    }

}

loadAdminRooms();

loadAdminBookings();