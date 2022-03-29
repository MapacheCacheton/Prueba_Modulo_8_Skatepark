const main = (function(){
    //Variables
    const url = 'http://localhost:3000/auth'
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

    async function loginUser(payload){
        console.log(payload);
        try {
            const res = await fetch(url, {
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
            localStorage.setItem(storage_token, token)
            redirect()
        }
    }

    function redirect(){
        location.href = 'http://localhost:3000/data'
    }

    function init(){
        const token = localStorage.getItem(storage_token)
        if(token){
            redirect()
        }
    }

    return {init}
})()
main.init()