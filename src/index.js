//Import dependencies
const express = require('express')
const exphbs = require('express-handlebars')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const expressFileUpload = require('express-fileupload')
const path = require('path')
const crypto = require('crypto')

//Import functions
const {getSkaters, insertSkater, selectSkaterForLogin} = require('./querys')

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
    
//Server routes    
app.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})

app.get('/css', (req, res)=>{
    res.sendFile(`estilos.css`)
})

app.get('/', async (req, res)=>{
    res.render('Lista')
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
    const data = await getSkaters()
    res.send(JSON.stringify(data))
})

app.use('/skater', (req, res, next)=>{
    const {pass1, pass2} = req.body
    if(pass1 === pass2) next()
    else res.redirect('/Register')
})

app.post('/skater', (req, res)=>{  
    const {files} = req.files
    const photo = `${req.body.name}.jpg`  
    files.mv(`${__dirname}/public/img/${photo}`, async (err)=>{
        await insertSkater(req.body, photo)
        if(err) throw err
        res.redirect('/login')
    })
})

app.post('/auth', async (req, res)=>{
    const {email, password} = req.body
    console.log(req.body);
    if(req.body){
        const skaters = await selectSkaterForLogin()
        const skater = skaters.find(s=>s.email==email && s.password == password)
        if(skater){
            const token = jwt.sign({
                exp: Math.floor(Date.now() / 1000) + 300,
                data: req.body
            }, token_secret)
            res.send(JSON.stringify(token))
        }
        else{
            res.statusCode = 401
            res.send({error:401, message:'Email o contraseña incorrectos'})
        }
    }
})
