function validateApprovedSkater(arr_skaters){
    arr_skaters.forEach(skater=>{
        if(skater.state == false) {
            skater.state='En revisión'
            skater.colorText = 'text-warning'
        }
        else {
            skater.state='Aprobado'
            skater.colorText = 'text-success'
        }
    })
    return arr_skaters
} 


module.exports = {validateApprovedSkater}