var youtube = require("./index.js");
const assert = require('assert');

var mockMessage = {
    author: "@TESTUSER",
    content: ":youtube boringtrousers my life me",
    channel: {
        send: function (message) { return true; }
    }
};

var key = process.argv[2];

youtube["search"](mockMessage, { key: key })
.then(function (response) {
    assert.strictEqual(response, "@TESTUSER, https://www.youtube.com/watch?v=WMbixFBa2M4", "Default success message not populating correctly");
    return youtube["search"](
        mockMessage,
        { key: key, successMessage: "{mention} {mention} {mention} {videoLink} {videoLink} {mention}" },
    );
})
.then( function(response) {
    assert.strictEqual(response, "@TESTUSER @TESTUSER @TESTUSER https://www.youtube.com/watch?v=WMbixFBa2M4 https://www.youtube.com/watch?v=WMbixFBa2M4 @TESTUSER", "Custom success message not populating correctly");
    return youtube["search"](
        Object.assign({}, mockMessage, { content: ":youtube habababalagarabagatatatara" }),
        { key: key }
    );
})
.then( function(response) {
    assert.strictEqual(response, "Sorry, @TESTUSER, I couldn't find a video for that...", "Standard failure message not populating correctly");
    return youtube["search"](
        Object.assign({}, mockMessage, { content: ":youtube habababalagarabagatatatara" }),
        { key: key, failureMessage: "{mention} {mention} {mention} {mention}" }
    );
})
.then( function(response) {
    assert.strictEqual(response, "@TESTUSER @TESTUSER @TESTUSER @TESTUSER", "Custom failure message not populating correctly");
});