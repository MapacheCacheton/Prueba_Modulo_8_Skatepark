const main = (function(){
    //Variables
    const url_ = 'http://localhost:3000/'
    const storage_token = 'jwt_token'


    //DomCache
    const form = document.querySelector('form')

    //Event Handler
    form.addEventListener('submit', submitHandler)
    
    //Functions
    async function init(){
        const data = {token:localStorage.getItem(storage_token)}
        if(data.token){
            const res_validation = await validateToken(data)
            if(res_validation.email){
                form.email.value = res_validation.email
                localStorage.setItem(storage_token, res_validation.token)
            }
            else{
                localStorage.removeItem(storage_token)
                location.href = 'http://localhost:3000/login'
            }
            
        } 
        else location.href = 'http://localhost:3000/login'
        
    }

    async function submitHandler(e){
        e.preventDefault()
        const is_validated = validateSamePassword(this.password.value, this.password2.value)
        if (is_validated) {
            const payload = new FormData(form)
            payload.delete('password2')
            payload.append('email', form.email.value)
            const {approved} = await putSkater(payload)
            if(approved) location.href = 'http://localhost:3000/list'
            else alert('Ha ocurrido un error, intente de nuevo mas tarde')
        }
        else alert('Las contraseñas no coinciden')
    }

    async function validateToken(token){
        try {
            const res = await fetch(url_+'validate', {
                headers:{
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(token)
            })
            return await res.json() 
        } catch (e) {
            console.error(e.message);
        }
    }

    async function putSkater(payload){
        try {
            const res = await fetch(url_+'skater', {
                method: 'PUT',
                body: payload
            })
            return await res.json()
        } catch (e) {
            console.error(e.message);
        }
    }

    function validateSamePassword(pass1, pass2){
        if(pass1 === pass2)return true
        return false
    }

    return {init}
})();

main.init()