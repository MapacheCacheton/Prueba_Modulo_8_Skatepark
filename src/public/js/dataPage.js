const main = (function(){
    //Variables
    const url_ = 'http://localhost:3000/'
    const storage_token = 'jwt_token'


    //DomCache
    const form = document.querySelector('form')
    const button = document.querySelector('#button')
    const admin_button = document.querySelector('#admin_button')
    const message_label = document.querySelector('#message')

    //Event Handler
    form.addEventListener('submit', submitHandler)
    button.addEventListener('click', clickHandler)
    admin_button.addEventListener('click', redirectToAdminPage)
    
    //Functions
    async function init(){
        const data = {token:localStorage.getItem(storage_token)}
        if(data.token){
            const res_validation = await validateToken(data)
            if(res_validation.admin) admin_button.classList.toggle('d-block')
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

    async function clickHandler(e){
        e.preventDefault()
        const payload = {email: form.email.value}
        console.log(message_label);
        const {approved} = await deleteUser(payload)
        if(approved) {
            message_label.innerHTML = 'Usuario eliminado'
            setTimeout(()=>{
                localStorage.removeItem(storage_token)
                location.href = 'http://localhost:3000/'
            }, 5000)
        }
        else alert('Ha ocurrido un error, intente de nuevo mas tarde')
    }

    function redirectToAdminPage(e){
        e.preventDefault()
        location.href = 'http://localhost:3000/admin'
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

    async function deleteUser(payload){
        try {
            const res = await fetch(url_+'skater', {
                headers:{
                    'Content-Type': 'application/json'
                },
                method: 'DELETE',
                body: JSON.stringify(payload, null, 2)
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