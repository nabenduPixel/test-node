const axios = require('axios');


class astroService {

    constructor() {
        // Set the API endpoint and headers for the Vedic Astro API
        this.apiEndPoint = process.env.VEDICASTRO_ENDPOINT || 'https://api.vedicastroapi.com/v3-json/horoscope/personal-characteristics';
        this.apiKey = process.env.VEDICASTRO_API_KEY || '810e81ef-8b39-5db4-9ebb-80ac6d66d377'; // Default to provided key if not in env
        this.apiHeaders = {
            'Content-Type': 'application/json',
        };
    }

    // Function to get personal characteristics
    async getPersonalCharacteristics(dob, tob, lat, lon, tz, lang = 'be') {
        const params = {
            api_key: this.apiKey,
            dob: dob,
            tob: tob,
            lat: lat,
            lon: lon,
            tz: tz,
            lang: lang
        };

        try {
            const response = await axios.get(this.apiEndPoint, params, { headers: this.apiHeaders });
            return response.data;
        } catch (error) {
            console.error("Error fetching horoscope data:", error);
            throw error;
        }
    }
}

// Example usage
(async () => {
    // const horoscopeApi = new astroService();
    try {
        const data = await horoscopeApi.getPersonalCharacteristics("26/01/1990", "11:42", "22.6714239", "88.3610014", 5.5);
        console.log("Horoscope data:", data);
    } catch (error) {
        console.log("Failed to retrieve data:", error.message);
    }
})();


module.exports = new astroService();