const token = localStorage.getItem("token");

const storedUser = localStorage.getItem("user");


if (!token || !storedUser) {

    window.location.href = "login.html";

}


const user = JSON.parse(storedUser);


const welcomeMessage =
    document.getElementById("welcomeMessage");


if (welcomeMessage) {

    welcomeMessage.textContent =
        `Welcome, ${user.full_name}`;

}


const logoutButton =
    document.getElementById("logoutButton");


if (logoutButton) {

    logoutButton.addEventListener("click", () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        window.location.href =
            "login.html";

    });

}


async function loadDashboard() {

    try {

        const roomsResponse = await fetch(
            `${API_BASE_URL}/rooms`,
            {

                headers: {

                    Authorization:
                        `Bearer ${token}`

                }

            }
        );


        const roomsData =
            await roomsResponse.json();


        if (roomsResponse.ok) {

            const rooms =
                roomsData.rooms || [];


            const availableRooms =
                rooms.filter(
                    room =>
                        room.status === "Available"
                );


            document.getElementById(
                "availableRooms"
            ).textContent =
                availableRooms.length;

        }


        const bookingsResponse = await fetch(
            `${API_BASE_URL}/bookings`,
            {

                headers: {

                    Authorization:
                        `Bearer ${token}`

                }

            }
        );


        const bookingsData =
            await bookingsResponse.json();


        if (bookingsResponse.ok) {

            const bookings =
                bookingsData.bookings || [];


            document.getElementById(
                "totalBookings"
            ).textContent =
                bookings.length;


            const pending =
                bookings.filter(
                    booking =>
                        booking.status === "Pending"
                );


            const approved =
                bookings.filter(
                    booking =>
                        booking.status === "Approved"
                );


            document.getElementById(
                "pendingBookings"
            ).textContent =
                pending.length;


            document.getElementById(
                "approvedBookings"
            ).textContent =
                approved.length;

        }

    }

    catch (error) {

        console.error(
            "Dashboard error:",
            error
        );

    }

}


loadDashboard();