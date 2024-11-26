const createResponseHandler = (req, res, next) => {

    res.success = ({ data = {}, message, statusCode = 200 }) => {
        res.status(statusCode).json({
            res_code: 200,
            response: message ?? "Success",
            data,
        });
    };

    res.error = ({ message, statusCode = 200 }) => {
        res.status(statusCode).json({
            res_code: 201,
            response: message || "Error",
        });
    };

    res.exception = ({ moduleName = "", message, error = {}, statusCode = 200 }) => {
        require("./logHandler").errorLog({ moduleName, request: req.body, error })
        res.status(statusCode).json({
            res_code: 201,
            response: message || "Something unexpected happened. Try again later.",
            server_message: error.message ?? '',
            stacktrace: error.stack
        })
    }

    next();
};

module.exports = createResponseHandler;
