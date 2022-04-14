const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const token_secret = crypto.randomBytes(64).toString('hex')

function validateJwt(error, token){
    const response = jwt.verify(token, token_secret, (err, data)=>{
        if(err) return error
        else{
            const info ={
                email: data.data.email,
                password: data.data.password,
                admin: data.data.admin,
            }
            const new_token = createJWT(info)
            const new_info = {
                email: info.email,
                admin: info.admin,
                token: new_token
            }
            return new_info
        }
    })
    return response
}

function createJWT(data){
    return jwt.sign({
        exp: Math.floor(Date.now() / 1000) + 3600,
        data: data
    }, token_secret)
}

module.exports = {createJWT, validateJwt}