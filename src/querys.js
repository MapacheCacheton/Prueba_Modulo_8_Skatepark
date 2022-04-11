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
//Implementar transacciones
async function insertSkater(skater, photo){
    try {
        const new_skater = reorderSkaterData(skater, photo)
        const data = Object.values(new_skater)
        const querySql = {
            text: `INSERT INTO skaters (email, name, password, experience, speciality, photo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING*;`,
            values: data
        }
        const results = await pool.query(querySql)
        return results.rowCount
    } catch (e) {
        console.error(e.message);
        if(e.code == 23505){
            return {message:'El email ya está registrado'} 
        }
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
        const results = await pool.query(querySql)
        return results.rowCount
    } catch (e) {
        console.error(e.message);
    }
}

async function selectSkaterForLogin(data){
    try {
        const new_data = Object.values(data)
        const querySql = {
            text: `SELECT * FROM skaters Where email=$1 AND password=$2;`,
            values: new_data
        }
        const results = await pool.query(querySql)
        console.log(results.rows);
        return results.rowCount
    } catch (error) {
        
    }
}


module.exports = {getSkaters, insertSkater, selectSkaterForLogin, updateSkaterInfo}