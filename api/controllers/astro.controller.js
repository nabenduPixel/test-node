const validateRequest = require('../validation/astro.validation');
const astroService = require('../services/astro.service')


class AstroContainer {

    async searchHoroscope(req, res) {
        const errorData = validateRequest.validateHoroscopeRequest(req.body);
        if (errorData) return res.error({ message: errorData });
        try {
            const respone = astroService.horoscopeApi();
            return res.success({data:respone})
        } catch (error) {
            return res.exception(error);
        }
    }

}

module.exports = new AstroContainer();