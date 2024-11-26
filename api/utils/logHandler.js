
async function operationLog (payload,id=null) {
    const OperationLog = require("../models/operationLog.model")
    if(id) {
        await OperationLog.findByIdAndUpdate(id, payload);
    }else{
        const doc=await OperationLog.create(payload);
        return doc._id;
    }
}

async function errorLog (payload) {
    const ErrorLog = require("../models/errorLog.model")
    await ErrorLog.create({
        module: payload.moduleName,
        request: JSON.stringify(payload.request),
        stack: payload.error?.stack,
    })
}

module.exports = { operationLog, errorLog }