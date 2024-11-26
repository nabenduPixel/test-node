exports.searchRequest = (data) => {
    const requestBody = {
        "start_place_id": data.start_place_id,
        "end_place_id": data.end_place_id,
        "start_point": data.start_point_instructions,
        "end_point": data.end_point_instructions,
        "start_time_date": data.start_time_date,
        "start_time_time": data.start_time_time,
        "passengers": parseInt(data.passengers),
        "luggage": parseInt(data.luggage)
    }
    if (data.travel_type === 'hourly') {
        requestBody.end_time_date = data.end_time_date;
        requestBody.end_time_time = data.end_time_time;
    }
    return requestBody;
}


exports.bookingRequest = async (bookingData) => {

    const externalRequest = JSON.parse(bookingData.statusResponse.external_request);
    let end_time_time = '';
    let end_time_date = ''; 

    function addHoursToTime(time, hoursToAdd) {
        const [hours, minutes] = time.split(':').map(Number);
        let newHours = hours + Number(hoursToAdd);
        newHours = newHours % 24;
        return `${String(newHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }

    if (externalRequest.travel_type === 'oneway') {
        end_time_date = '';
        end_time_time = '';
    } else if (externalRequest.travel_type === 'hourly' && externalRequest.hourly_duration) {
        end_time_time = addHoursToTime(externalRequest.start_time_time, externalRequest.hourly_duration);
        end_time_date = externalRequest.service_end_date;
    }

    const data = {
        email: "info@lvinfosolution.site",
        first_name: bookingData.customerDetails.first_name,
        last_name: bookingData.customerDetails.last_name,
        mobile: `+${bookingData.customerDetails.mobile_code}${bookingData.customerDetails.mobile_number}`,
        luggage: externalRequest.luggage || '',
        passengers: externalRequest.passengers || '',
        vehicle: externalRequest.vehicle || '',
        start_time_date: externalRequest.service_start_date,
        start_time_time: externalRequest.start_time_time,
        end_time_date: end_time_date,
        end_time_time: end_time_time,
        start_place_id: externalRequest.start_place_id,
        end_place_id: externalRequest.end_place_id,
        payment_method: 'default'
    };

    return data;
}