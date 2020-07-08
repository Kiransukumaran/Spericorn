const nodemailer = require('nodemailer');
const { SMTP_CONFIG } = require('../environments');

const transport = nodemailer.createTransport(SMTP_CONFIG);

module.exports = transport;