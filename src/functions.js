function reorderUserData(skater, photo = false){
    const skater_info = {
        email: skater.email,
        name: skater.name,
        password: skater.password,
        experience: skater.experience,
        speciality: skater.speciality
    }
    if(photo) skater_info.photo = photo
    return skater_info
}

function createTokenBody(records){
    return obj_user = {
        email: records.user[0].email,
        password: records.user[0].password,
        admin: records.user[0].admin
    }
}

module.exports = {reorderUserData, createTokenBody}