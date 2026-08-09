const db = require("../config/db");

const createUser = (userData, callback) => {
    const sql = `
        INSERT INTO users
        (full_name, student_id, email, phone, password)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            userData.full_name,
            userData.student_id,
            userData.email,
            userData.phone,
            userData.password
        ],
        callback
    );
};

const findUserByEmail = (email, callback) => {
    db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        callback
    );
};

module.exports = {
    createUser,
    findUserByEmail
};