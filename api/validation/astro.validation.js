exports.validateHoroscopeRequest = (body) => {
    if (!body.date_of_birth) return 'Country code is required'
    if (!body.time_of_birth) return 'Mobile number is required'
    if (body.lat) return 'Mobile number is not valid'
    if (!body.lon) return 'Paramter is missing'
    if (!body.time_zone) return 'Paramter is missing'
    if (!body.language) return 'Paramter is missing'
}
