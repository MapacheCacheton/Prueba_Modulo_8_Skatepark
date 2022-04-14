//Import dependencies
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const expressFileUpload = require('express-fileupload')
const path = require('path')


//Import functions
const {getUser, insertUser, selectUserForLogin, updateUser, deleteUser, reactivateUser, updateState} = require('./querys')
const {createTokenBody} = require('./functions')
const {createJWT, validateJwt} = require('./jwt_functions')

//Global variables
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
app.get('/admin', async (req, res)=>{
    res.render('AdminList')
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
            if(reactived) res.status(200).send({approved:true})
            else res.status(500).send({approved:false})
        }
        else if(records>0){
            files.mv(`${__dirname}/public/img/${photo}`, (err)=>{
                if(err) throw err
            })
            res.status(200).send({approved:true})
        } 
        else res.status(500).send({approved:false})
})

app.put('/skater', async (req, res)=>{
    const records = await updateUser(req.body)
    if(records>0) res.status(200).send({approved:true})
    else res.status(500).send({approved:false})
})

app.delete('/skater', async (req, res)=>{
    const records = await deleteUser(req.body)
    if(records == 1) res.status(200).send({approved:true})
    else res.status(500).send({approved:false})
})

app.post('/state', async (req, res)=>{
    console.log(req.body);
    const records = await updateState(req.body)
    if(records==1) res.status(200).send({approved:true})
    else res.status(500).send({approved:false})
})

app.post('/auth', async (req, res)=>{
    const error_default = {error:401, message:'Email o contraseña incorrectos'}
    if(req.body.email && req.body.password){
        const records = await selectUserForLogin(req.body)
        if(records.selected==1){
            const obj_user = createTokenBody(records)
            const token = createJWT(obj_user)
            res.send(JSON.stringify({token: token, user: obj_user}))
        }
        else res.send(error_default)
    }
    else res.send(error_default)
})
app.post('/validate', async (req, res)=>{
    const {token} = req.body
    const error_default = {error:401, message: 'Usuario no autorizado'}
    if(token){
        const result = validateJwt(error_default, token)
        console.log(result);
        res.send(JSON.stringify(result))
    }
    else res.send(error_default)
})