const test = require("tape");
const nock = require("nock");
const rspamdClient = require("./index");
const nockOptions = { allowUnmocked: !!process.env.TEST_UNMOCKED };
const fs = require("fs");

test("check does a request to rspamd", (assert) => {
    const client = rspamdClient();

    nock(/localhost:11333/, nockOptions)
        .post('/check')
        .reply(200, { default: { is_spam: true } });

    client.check("./fixtures/spam.eml", (err, result) => {
        assert.ok(!err, "no error");
        assert.ok(result.isSpam, "result is spam");
        nock.cleanAll();
        assert.end();
    });
});

test("takes a Readable", (assert) => {
    const client = rspamdClient();
    const source = fs.createReadStream("./fixtures/spam.eml");

    nock(/localhost:11333/, nockOptions)
        .post('/check')
        .reply(200, { default: { is_spam: true } });

    client.check(source, (err, result) => {
        assert.ok(!err, "no error");
        assert.ok(result.isSpam, "result is spam");
        nock.cleanAll();
        assert.end();
    });
});

test("constructor can set host/port", (assert) => {
    nock(/foohost:12345/)
        .post('/check')
        .reply(200, { default: { is_spam: true } });

    const client = rspamdClient({
        host: "foohost",
        port: "12345"
    });

    client.check("./fixtures/spam.eml", (err, result) => {
        assert.ok(!err, "no error");
        assert.ok(result.isSpam, "result is spam");
        nock.cleanAll();
        assert.end();
    });
});

test("returns a promise", (assert) => {
    const client = rspamdClient();

    nock(/localhost:11333/, nockOptions)
        .post('/check')
        .reply(200, { default: { is_spam: true } });

    client.check("./fixtures/spam.eml").then((result) => {
        assert.ok(result.isSpam, "result is spam");
        nock.cleanAll();
        assert.end();
    });
});