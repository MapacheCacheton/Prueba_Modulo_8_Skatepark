const main = (function(){
    //Variables
    const url_ = 'http://localhost:3000/'

    //Dom Cache
    const form = document.querySelector('form')

    //Events
    form.addEventListener('submit', submitHandler)

    //Functions
    async function submitHandler(e){
        e.preventDefault()
        const is_validated = validateSamePassword(this.password.value, this.pass2.value)
        if(is_validated){
            const payload = new FormData(form)
            payload.delete('pass2')
            console.log(payload.get('files'));
            const {approved} = await postSkater(payload)
            if(approved) location.href = 'http://localhost:3000/login'
            else alert('Ha ocurrido un error, intentelo mas tarde')
        }
        else alert('Las contraseñas no coinciden')
    }

    async function postSkater(payload){
        try {
            const res = await fetch(`${url_}skater`,{
                method: 'POST',
                body: payload
            })
            return await res.json()
        } catch (err) {
            console.error(e.message);
        }
    }

    function validateSamePassword(pass1, pass2){
        if(pass1 === pass2)return true
        return false
    }
})()