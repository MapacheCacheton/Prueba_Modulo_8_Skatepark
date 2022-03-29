const {Pool} = require('pg')

const config = {
    user: 'byron',
    host: 'localhost',
    password: '1234',
    database:'skatepark',
    port: 5432,
    max: 20,
    idleTimeoutMillis: 5000,
    connectionTimeoutMillis: 2000
}

const pool = new Pool(config)

module.exports = pool