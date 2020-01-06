

require('dotenv').config();

exports.session = {
    secret: process.env.SESSION_SECRET_KEY,
};

exports.config = {
    "DRONE_DATA_TIMEOUT": process.env.TTL_MILLISECONDS,
    "HTTP_SERVER": {
        Addr: process.env.HTTP_SERVER_ADDR,
        Port: process.env.HTTP_SERVER_PORT,
        socketPort: process.env.HTTP_SOCKET_PORT
    },
    "ADMIN_PASS": process.env.ADMIN_PASS,
    "SESSION_SECRET_KEY": process.env.SESSION_SECRET_KEY,
    "ENVIRONMENT": process.env.NODE_ENV

};