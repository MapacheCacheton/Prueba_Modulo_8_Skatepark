const pool = require('./connection')
const {validateApprovedSkater} = require('./validations')
const {reorderUserData} = require('./functions')

async function getUser(){
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
async function insertUser(user, photo){
    try {
        const new_skater = reorderUserData(user, photo)
        const data = Object.values(new_skater)
        const querySql = {
            text: `INSERT INTO skaters (email, name, password, experience, speciality, photo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING*;`,
            values: data
        }
        await pool.query('BEGIN')
        const results = await pool.query(querySql)
        await pool.query('COMMIT')
        return results.rowCount
    } catch (e) {
        await pool.query('ROLLBACK')
        if(e.code == 23505){
            return 'disabled'
        }
        return 0
    }
}

async function reactivateUser(email){
    try {
        await pool.query('BEGIN')
        const results = await pool.query(`UPDATE skaters SET deleted=false WHERE email='${email}' RETURNING*;`)
        await pool.query('COMMIT')
        return results.rowCount
    } catch (error) {
        await pool.query('ROLLBACK')
        return 0
    }
}

async function updateUser(skater){
    try {
        const new_skater = reorderUserData(skater)
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

async function selectUserForLogin(data){
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

async function deleteUser(user){
    const data = [user.email]
    const querySql = {
        text: `UPDATE skaters SET deleted=true WHERE email=$1 RETURNING*;`,
        values: data
    }
    try {
        await pool.query('BEGIN')
        const results = await pool.query(querySql)
        await pool.query('COMMIT')
        return results.rowCount
    } catch (error) {
        await pool.query('ROLLBACK')
    }
}

module.exports = {getUser, insertUser, selectUserForLogin, updateUser, deleteUser, reactivateUser}