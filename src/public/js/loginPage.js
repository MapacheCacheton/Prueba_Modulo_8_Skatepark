const main = (function(){
    //Variables
    const url_ = 'http://localhost:3000/'
    const storage_token = 'jwt_token'

    //Dom cache
    const form = document.querySelector('form')

    const error_label = document.querySelector('.text-danger')
    const inputs = document.querySelectorAll('input')

    //Event Listener
    form.addEventListener('submit', submitHandler)
    form.email.addEventListener('click', clickHandler)
    form.password.addEventListener('click', clickHandler)
    
    //functions
    async function init(){
    const token = localStorage.getItem(storage_token)
        if(token){
            const response = await apiValidateToken(token)
            if(response.token) {
                localStorage.setItem(storage_token, response.token)
                if(response.admin) location.href = 'http://localhost:3000/admin'
                else location.href = 'http://localhost:3000/data'
            }
        }
    }

    async function submitHandler(e){
        e.preventDefault()
        const payload = new FormData(this)
        const token = await loginUser(payload)
        validateToken(token)
    }
    function clickHandler(e){
        e.preventDefault()
        error_label.innerHTML = ''
    }

    async function apiValidateToken(token){
        try {
            const res = await fetch(`${url_}validate`, {
                headers:{
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({token:token})
            })
            return await res.json() 
        } catch (e) {
            console.error(e.message);
        }
    }

    async function loginUser(payload){
        try {
            const res = await fetch(`${url_}auth`, {
                method: 'POST',
                body: payload
            })
            return await res.json() 
        } catch (e) {
            console.error(e.message);
        }
    }

    function validateToken(token){
        if(token.error) error_label.innerHTML = token.message
        else {
            localStorage.setItem(storage_token, token.token)
            redirect(token)
        }
    }

    function redirect(token = false){
        if(token.user.admin) location.href = 'http://localhost:3000/admin'
        else location.href = 'http://localhost:3000/data'
    }
    

    return {init}
})()
main.init()