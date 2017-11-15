const http = require("http");
const fs = require("fs");

const camelize = (str) => str.replace(/_(\w)/g, (m) => m.slice(1).toUpperCase());
const isUpperCase = /^[A-Z]/;
const promisify = require("util").promisify;

const parseResult = (collect) => {
    collect = JSON.parse(collect);

    let result = {};

    for (let key in collect.default) {
        if (!isUpperCase.test(key))
            result[camelize(key)] = collect.default[key];
    }

    return result;
};

const defaultOptions = {
    host: 'localhost',
    port: 11333,
};

const request = (options, source, done) => {
    const req = http.request(options, (res) => {
        let collect = "";
        res.setEncoding('utf8');
        res.on('data', (chunk) => collect += chunk);
        res.on('end', () => {
            done(null, parseResult(collect), collect);
        });
    });
    req.on('error', (err) => done(err));
    source.pipe(req);
};

const post = (path, options, source, done) => {
    options = Object.assign({
        method: "POST",
        path: path
    }, options);

    if (typeof source == "string")
        source = fs.createReadStream(source);

    if (done) return request(options, source, done);
    return promisify(request)(options, source);

};

function RspamdClient (options) {
    options = Object.assign({}, defaultOptions, options);
    
    return {
        check: (source, done) => post("/check", options, source, done),
        symbols: (source, done) => post("/symbols", options, source, done),
        learnSpam: (source, done) => post("/learnspam", options, source, done),
        learnHam: (source, done) => post("/learnham", options, source, done)
    };
}


module.exports = RspamdClient;