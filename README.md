# rspamd-client

This is a simple node.js client to the rspamd http interface.

## Installation

    npm install rspamd-client

The client interacts with the rspamd http service directly, so you must have rspamd running locally
See [rspamd docs](https://rspamd.com/doc/quickstart.html) for installing rspamd.
    
## Usage

    const rspamdClient = require("rspamd-client");
    const client = rspamdClient();
    
    client.check("path/to/spam", (err, result) => {
        if (result.isSpam)
            console.log("Found spam. Lets get rid of it");
    });


    