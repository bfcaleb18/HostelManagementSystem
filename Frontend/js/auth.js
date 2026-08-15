const loginForm = document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();


        const email = document.getElementById("email").value;

        const password = document.getElementById("password").value;

        const message = document.getElementById("loginMessage");


        message.textContent = "Logging in...";


        try {

            const response = await fetch(
                `${API_BASE_URL}/auth/login`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        email: email,

                        password: password

                    })

                }
            );


            const data = await response.json();


            if (!response.ok) {

                message.textContent =
                    data.message || "Login failed";

                return;

            }


            localStorage.setItem(
                "token",
                data.token
            );


            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );


            message.textContent =
                "Login successful. Redirecting...";


            setTimeout(() => {

                if (data.user.role === "admin") {

    window.location.href = "admin.html";

} else {

    window.location.href = "dashboard.html";

}

            }, 1000);

        }

        catch (error) {

            console.error(error);

            message.textContent =
                "Unable to connect to the server.";

        }

    });

}

const registerForm = document.getElementById("registerForm");


if (registerForm) {

    registerForm.addEventListener("submit", async (event) => {

        event.preventDefault();


        const fullName =
            document.getElementById("full_name").value.trim();

        const studentId =
            document.getElementById("student_id").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const phone =
            document.getElementById("phone").value.trim();

        const password =
            document.getElementById("password").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        const message =
            document.getElementById("registerMessage");


        if (password !== confirmPassword) {

            message.textContent =
                "Passwords do not match.";

            return;

        }


        if (password.length < 6) {

            message.textContent =
                "Password must be at least 6 characters.";

            return;

        }


        message.textContent =
            "Creating account...";


        try {

            const response = await fetch(
                `${API_BASE_URL}/auth/register`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        full_name: fullName,

                        student_id: studentId,

                        email: email,

                        phone: phone,

                        password: password

                    })

                }
            );


            const data = await response.json();


            if (!response.ok) {

                message.textContent =
                    data.message || "Registration failed.";

                return;

            }


            message.textContent =
                "Registration successful! Redirecting to login...";


            setTimeout(() => {

                window.location.href =
                    "login.html";

            }, 1500);

        }

        catch (error) {

            console.error(error);

            message.textContent =
                "Unable to connect to the server.";

        }

    });

}