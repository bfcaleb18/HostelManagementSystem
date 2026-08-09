const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");

const register = async (req, res) => {

    const {
        full_name,
        student_id,
        email,
        phone,
        password
    } = req.body;

    try {

        const hashedPassword = await bcrypt.hash(password, 10);

        User.createUser(
            {
                full_name,
                student_id,
                email,
                phone,
                password: hashedPassword
            },

            (err) => {

                if (err) {

                    return res.status(500).json({
                        message: err.message
                    });

                }

                res.status(201).json({
                    message: "Registration successful"
                });

            }

        );

    }

    catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

const login = (req, res) => {

    const { email, password } = req.body;

    User.findUserByEmail(email, async (err, results) => {

        if (err) {

            return res.status(500).json({
                message: err.message
            });

        }

        if (results.length === 0) {

            return res.status(401).json({
                message: "Invalid email or password"
            });

        }

        const user = results[0];

        const validPassword = await bcrypt.compare(
            password,
            user.password
        );

        if (!validPassword) {

            return res.status(401).json({
                message: "Invalid email or password"
            });

        }

        const token = jwt.sign(

            {
                id: user.id,
                role: user.role
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "1d"
            }

        );

        res.json({

            message: "Login successful",

            token,

            user: {

                id: user.id,
                full_name: user.full_name,
                email: user.email,
                role: user.role

            }

        });

    });

};
module.exports = {
    register,
    login
};