let utils = {}

utils.showRequestUrl = (req) => {
    let host = req.headers.host;
    let url = req.url;
    let method = req.method;
    let msg = "\n" + method + " - " + host + url;

    console.log(msg)
}

utils.getRequestUrl = (req) => {
    let host = req.headers.host;
    let url = req.url;
    let method = req.method;
    let msg = "\n" + method + " - " + host + url;

    return msg;
}

utils.getToken = (req) => {
    return req.headers['x-access-token'] || req.body.token || req.query.token;
}

utils.validarId = (id) => {
    let regexp = new RegExp(/^(0|[1-9][0-9]*)$/);
    
    return regexp.test(id);
}

module.exports = utils;