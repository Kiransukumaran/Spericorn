module.exports = {
    JWT_SECRET: "SECRET@JWT",
    PASSWORD_SECRET: "SECRET@PASSWORD",
    DB_URL: "mongodb://localhost:27017/login",
    SMTP_CONFIG: {
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            "user":"",
            "pass": ""
        },
        secure: false
    }
}