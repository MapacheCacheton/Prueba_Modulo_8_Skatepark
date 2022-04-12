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

module.exports = {reorderUserData}