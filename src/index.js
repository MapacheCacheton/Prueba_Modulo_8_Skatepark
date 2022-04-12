//Import dependencies
const express = require('express')
const exphbs = require('express-handlebars')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const expressFileUpload = require('express-fileupload')
const path = require('path')
const crypto = require('crypto')

//Import functions
const {getUser, insertUser, selectUserForLogin, updateUser, deleteUser, reactivateUser} = require('./querys')

//Global variables
const token_secret = crypto.randomBytes(64).toString('hex')
const app = express()
const port = 3000

//Handlebars config
app.set('views', path.join(`${__dirname}/views`))//Se establece la ruta a la carpeta views
app.engine('.hbs', exphbs.engine({//Se configura handlebars
    defaultLayout: 'index',
    layoutsDir: path.join(app.get('views'), 'layout'),
    extname: '.hbs'
}))
app.set('view engine', '.hbs')

//Public dir
app.use(express.static(path.join(`${__dirname}/public`)))
app.use(express.static(path.join(__dirname,`public/css`)))

//Body parser config
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//Express file upload config
app.use(
    expressFileUpload({
        limits: 5000000,
        abortOnLimit: true,
        responseOnLimit: 'El tamaño de la imagen supera el liite permitido'
    })
)

//Functions
function createJWT(data){
    return jwt.sign({
        exp: Math.floor(Date.now() / 1000) + 3600,
        data: data
    }, token_secret)
}
    
//Server routes    
app.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})
app.get('/css', (req, res)=>{
    res.sendFile(`estilos.css`)
})
app.get('/', async (req, res)=>{
    res.render('List')
})
app.get('/list', async (req, res)=>{
    res.render('UserList')
})
app.get('/login', (req, res)=>{
    res.render('Login')
})
app.get('/register', (req, res)=>{
    res.render('Register')
})
app.get('/data', (req, res)=>{
    res.render('Data')
})

//API ENDPOINTS
app.get('/skaters', async (req, res)=>{
    const data = await getUser()
    res.send(JSON.stringify(data))
})

app.post('/skater', async (req, res)=>{  
    const {files} = req.files
    const photo = `${req.body.name}.jpg`  
    const records = await insertUser(req.body, photo)
        if(records == 'disabled') {
            const reactived = await reactivateUser(req.body.email)
            if(reactived) res.send({approved:true})
            else res.send({approved:false})
        }
        else if(records>0){
            files.mv(`${__dirname}/public/img/${photo}`, (err)=>{
                if(err) throw err
            })
            res.send({approved:true})
        } 
        else res.send({approved:false})
})

app.put('/skater', async (req, res)=>{
    const records = await updateUser(req.body)
    if(records>0) res.send({approved:true})
    else res.send({approved:false})
})

app.delete('/skater', async (req, res)=>{
    const records = await deleteUser(req.body)
    if(records == 1) res.send({approved:true})
    else res.send({approved:false})
})

app.post('/auth', async (req, res)=>{
    console.log(req.body);
    if(req.body.email && req.body.password){
        const records = await selectUserForLogin(req.body)
        if(records==1){
            const token = createJWT(req.body)
            res.send(JSON.stringify(token))
        }
        else res.send({error:401, message:'Email o contraseña incorrectos'})
    }
    else res.send({error:401, message:'Email o contraseña incorrectos'})
})
app.post('/validate', async (req, res)=>{
    const {token} = req.body
    if(token){
        jwt.verify(token, token_secret, (err, data)=>{
            if(err) res.send({error:401, message: 'Usuario no autorizado'})
            else{
                const info ={
                    email: data.data.email,
                    password: data.data.password
                }
                const new_token = createJWT(info)
                const new_info = {
                    email: data.data.email,
                    token: new_token
                }
                res.send(new_info)
            }
        })
    }
    else res.send({error:401, message: 'Usuario no autorizado'})
})
