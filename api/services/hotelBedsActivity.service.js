const apiClient = require('../utils/apiClient');
const CryptoJS = require('crypto-js');


class hotelBedsActivityService {

    constructor() {
        this.apiEndPoint = process.env.HOTEL_BEDS_END_POINT;
        this.apiKey = process.env.HOTEL_BEDS_API_KEY;
        this.secret = process.env.HOTEL_BEDS_SECRET_KEY;
        const apiHeader = {
            'Api-key': this.apiKey,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
        this.api = apiClient(this.apiEndPoint,apiHeader);
        this.config = {
            validateStatus: false,
            metadata: {
                section: ''
            }
        };
    }


    generateSignature() {
        const timestamp = Math.floor(Date.now() / 1000);
        const data = this.apiKey + this.secret + timestamp;
        return CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
    }

    async getCountries() {
        this.config.metadata.section = 'hotel beds country api'
        const response = await this.api.get(`/activity-content-api/3.0/countries/en`, {
            ...this.config,
            headers: {
                ...this.api.defaults.headers,
                'X-Signature': this.generateSignature(),
            }
        });
        return response.data.countries;
    }
}

module.exports = new hotelBedsActivityService();