const main = (function(){
    //Variables
    const url_base = 'http://localhost:3000/skaters'

    //DomCache
    const t_body = document.querySelector('tbody')

    //Init
    async function init(){
        await renderTableSkaters()
    }

    async function renderTableSkaters(){
        const users = await getUsers()
        console.log(users);
        const html = users.map(user=>{
            const state = user.state? 'Aprobado': 'En revisión'
            const color = (state=='Aprobado')? 'text-success': 'text-warning'
            return `<tr><th scope="row">${user.id}</th>
            <td><div style="background-image: url('img/${user.photo}'); margin: 0 auto"
            ></div></td>
            <td>${user.name}</td>
            <td>${user.experience}</td>
            <td>${user.speciality}</td>
            <td class="${color} font-weight-bold">${state}</td></tr>`
            
        })
        t_body.innerHTML = html.join('')
    }

    async function getUsers(){
        try {
            const response = await fetch(url_base)
            return await response.json()
        } catch (e) {
            console.error(e.message);
        }
    }

    return {init}

})()

main.init()