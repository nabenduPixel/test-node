const apiClient = require('../utils/apiClient');
const talixoHelper = require('../helpers/talixo.helper');


class talixoService {

    constructor() {
        this.apiEndPoint = process.env.TALIXO_API_END_POINT;
        const apiHeader = {
            'Content-Type': 'application/json',
            "partner": process.env.TALIXO_API_KEY
        }
        this.api = apiClient(this.apiEndPoint, apiHeader);
        this.config = {
            validateStatus: false,
            metadata: {
                section: ''
            }
        };
    }


    async getVehicles(payload) {
        this.config.metadata.section = 'talixo vehicles api'
        const request = talixoHelper.searchRequest(payload);
        const response = await this.api.post(`/en/mapi/v3/vehicles/booking_query/`, request, {
            ...this.config
        });
        return response.data.limousines
    }


    async bookVehicle(payload) {
        this.config.metadata.section = 'talixo booking api'
        if (payload) {
            const request = payload;
            const response = await this.api.post(`/en/mapi/v3/bookings/`, request, {
                ...this.config
            });
            return response.data
        } else {
            return [];
        }
    }


    async retrieveVehicle(payload) {
        this.config.metadata.section = 'talixo retrive api'
        if (payload) {
            const response = await this.api.get(`/en/mapi/v3/bookings/${payload}`, {
                ...this.config
            });
            return response.data
        } else {
            return [];
        }
    }


    async cancelBooking(payload) {
        this.config.metadata.section = 'talixo cancel api'
        if (payload) {
            const response = await this.api.delete(`/en/mapi/v3/bookings/${payload.reference_code}/`, {
                ...this.config
            });
            console.log(response.data);
            
            return response.status == 204 ? true : false
        } else {
            return false;
        }
    }
}


module.exports = new talixoService();