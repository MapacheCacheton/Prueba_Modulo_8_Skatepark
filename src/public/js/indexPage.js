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
        const skaters = await getSkaters()
        const html = skaters.map(skater=>{
            const row = `<tr><th scope="row">${skater.id}</th>
            <td><div style="background-image: url('img/${skater.photo}'); margin: 0 auto"
            ></div></td>
            <td>${skater.name}</td>
            <td>${skater.experience}</td>
            <td>${skater.speciality}</td>
            <td class="${skater.colorText} font-weight-bold">${skater.state}</td></tr>`
            return row
        })
        t_body.innerHTML = html.join('')
    }

    async function getSkaters(){
        try {
            const response = await fetch(url_base)
            const skaters = await response.json()
            return skaters
        } catch (e) {
            console.error(e.message);
        }
    }

    return {init}

})()

main.init()