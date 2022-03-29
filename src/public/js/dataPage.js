const { json } = require("express/lib/response");

const main = (function(){
    //Variables
    const url_ = 'http://localhost:3000/skater'

    //DomCache
    const form = document.querySelector('form')

    //Event Handler
    form.addEventListener('submit', submitHandler)
    
    //Functions
    async function submitHandler(e){
        e.preventDefault()
        const payload = createPayload(this)
        payload ? await postSkater(payload) : alert('Las contraseñas no coinciden')
    }
    async function postSkater(payload){
        try {
            const res = await fetch(url_, {
                method: 'POST',
                body: JSON.stringify(payload),
            })
            console.log(res);
        } catch (e) {
            console.error(e.message);
        }
    }

    function createPayload(obj){
        const response = validateSamePassword(obj.pass1.value, obj.pass2.value)
        if(response){
            const payload ={
                email: obj.email.value,
                name: obj.name.value,
                password: obj.pass1.value,
                experience: obj.experience.value,
                speciality: obj.speciality.value
            }
            return payload
        }
        return false
    }

    function validateSamePassword(pass1, pass2){
        if(pass1 === pass2)return true
        return false
    }

    return {}
})();