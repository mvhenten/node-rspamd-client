# rspamd-client

`rspamd-client` is a thin wrapper around `http.request` that talks to the [rspamd](https://rspamd.com/) http interface.

## Installation

    npm install rspamd-client

**Note:** `rspamd-client` works by calling the *rspamd deamon* http endpoints directly.
This means you must have *rspamd* running for this to work.

See [rspamd docs](https://rspamd.com/doc/quickstart.html) for installing rspamd.
    
## Usage

    const rspamdClient = require("rspamd-client");
    const client = rspamdClient(options);
    
    client.check("path/to/spam", (err, result) => {
        if (result.isSpam)
            console.log("Found spam. Lets get rid of it");
    });
    
    // promise style:
    
    client.check("/path/to/spam").then(result => {
        console.log(result.isSpam, "is it spam?"");
    });
    
    
## Options

The `rspamd-client` accepts the following options:

* host - A hostname. Default is localhost
* port - Port where the rspamd deamon lives. Default is 11333

## Methods

`rspamd-client` provides a wrapper around the following endpoints:

* `/check`: client.check - Check message and return results
* `/symbols`: client.symbols - Same as check but also returns score & list
* `/learnspam`: client.learnSpam - Train bayes classifier on spam message
* `/learnspam`: client.learnHam - Train bayes classifier on ham message

See the [rspamd documentation](https://rspamd.com/doc/architecture/protocol.html) for more information.


    