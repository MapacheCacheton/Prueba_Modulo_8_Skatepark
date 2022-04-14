const main = (function(){
    //Variables
    const url_ = 'http://localhost:3000/'
    const storage_token = 'jwt_token'

    //DomCache
    const t_body = document.querySelector('tbody')
    const label = document.querySelector('label')
    const btn_log_out = document.querySelector('.btn-danger')
    const btn_datos = document.querySelector('.btn-success')

    //Events
    t_body.addEventListener('change', changeUserState)
    btn_log_out.addEventListener('click', logOut)
    btn_datos.addEventListener('click', redirectToDataPage)

    //Functions
    async function init(){
        await jwtValidation()
        await renderUsers()
    }

    async function changeUserState(e){
        if(e.target.classList.contains('check')){
            e.preventDefault()
            const checkbox = document.querySelector('input')
            const payload = {
                id: e.target.parentElement.parentElement.id,
                state: checkbox.checked
            }
            const {approved} = await apiChangeState(payload)
            if(approved) {
                if(checkbox.checked) label.innerHTML = 'El estado fue cambiado a "Aprobado"'
                else label.innerHTML = 'El estado fue cambiado a "En revisión"'
            } 
            else{
                checkbox.checked = (checkbox.checked)? false: true
                label.innerHTML = 'No fue posible cambiar el estado, intente de nuevo mas tarde'
            }
            setTimeout(()=>{
                label.innerHTML = ''
            }, 3000)
        }
    }

    function logOut(e){
        e.preventDefault()
        localStorage.removeItem(storage_token)
        location.href = 'http://localhost:3000/login'
    }

    function redirectToDataPage(e){
        e.preventDefault()
        location.href = 'http://localhost:3000/data'
    }

    async function apiChangeState(payload){
        try {
            const res = await fetch(`${url_}state`,{
                headers:{
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(payload)
            })
            return await res.json()
        } catch (e) {
            console.error(e.message);
        }
    }

    async function jwtValidation(){
        const token = localStorage.getItem(storage_token)
        if(token){
            const {token:new_token} = await apiValidateToken(token)
            if(!new_token){
                localStorage.removeItem(storage_token)
                location.href = 'http://localhost:3000/login'
            }
            return
        }
        else location.href = 'http://localhost:3000/login'
    }

    async function apiValidateToken(token){
        try {
            const res = await fetch(url_+'validate', {
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

    async function renderUsers(){
        const users = await getUsers()
        const users_html = users.map(user=>{
            const state = user.state? 'checked': ''
            return `<tr id="${user.id}"><th scope="row">${user.id}</th>
            <td><div style="background-image: url('img/${user.photo}'); margin: 0 auto"
            ></div></td>
            <td>${user.name}</td>
            <td>${user.experience}</td>
            <td>${user.speciality}</td>
            <td><input class="check" type="checkbox" ${state}/></td></tr>`
        })
        t_body.innerHTML = users_html.join('')
        return
    }

    async function getUsers(){
        try {
            const res = await fetch(`${url_}skaters`)
            return res.json()
        } catch (e) {
            console.error(e.message);
        }
    }

    return {init}
})()

main.init()