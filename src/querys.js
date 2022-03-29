const pool = require('./connection')
const {validateApprovedSkater} = require('./validations')
const {reorderSkaterData} = require('./functions')

async function getSkaters(){
    try {
        const query = {
            rowMode: 'Array',
            text: `SELECT id, photo, name, experience, speciality, state FROM skaters WHERE deleted = false ORDER BY id;`,
        }
        const results = await pool.query(query)
        const skaters = validateApprovedSkater(results.rows)
        return skaters
    } catch (e) {
        console.log(e.message);
    }
}

async function insertSkater(skater, photo){
    try {
        const new_skater = reorderSkaterData(skater, photo)
        const data = Object.values(new_skater)
        const querySql = {
            text: `INSERT INTO skaters (email, name, password, experience, speciality, photo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING*;`,
            values: data
        }
        const results = await pool.query(querySql)
    } catch (e) {
        console.error(e.message);
    }
}

async function updateSkaterInfo(skater){
    try {
        const new_skater = reorderSkaterData(skater)
        const data = Object.values(new_skater)
        const querySql = {
            text:`UPDATE skaters SET name=$2, password=$3, experience=$4, speciality=$5 WHERE email=$1 RETURNING*;`,
            values: data
        }
    } catch (e) {
        console.error(e.message);
    }
}

async function selectSkaterForLogin(){
    try {
        const query =  `SELECT email, password FROM skaters;`
        const {rows} = await pool.query(query)
        return rows
    } catch (e) {
        console.error(e.message);
    }
}


module.exports = {getSkaters, insertSkater, selectSkaterForLogin}