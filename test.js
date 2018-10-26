var youtube = require("./index.js");
const assert = require('assert');

var mockMessage = {
    author: "@TESTUSER",
    content: ":youtube BoringTrousers My Life Me",
    channel: {
        send: function (message) { return true; }
    }
};

var key = process.argv[2];

youtube(mockMessage, { youtube: { key: key } }, function (response) {
    assert.strictEqual(response, "@TESTUSER, https://www.youtube.com/watch?v=WMbixFBa2M4", "Default success message not populating correctly");
});

youtube(
    Object.assign({}, mockMessage, { content: ":youtube habababalagarabagatatatara" }),
    { youtube: { key: key } },
    function (response) {
        assert.strictEqual(response, "Sorry, @TESTUSER, I couldn't find a video for that...", "Default failure message not populating correctly");
    }
);

youtube(
    mockMessage,
    { youtube: { key: key, successMessage: "{mention} {mention} {mention} {videoLink} {videoLink} {mention}" } },
    function (response) {
        assert.strictEqual(response, "@TESTUSER @TESTUSER @TESTUSER https://www.youtube.com/watch?v=WMbixFBa2M4 https://www.youtube.com/watch?v=WMbixFBa2M4 @TESTUSER", "Custom success message not populating correctly");
    }
);

youtube(
    Object.assign({}, mockMessage, { content: ":youtube habababalagarabagatatatara" }),
    { youtube: { key: key, failureMessage: "{mention} {mention} {mention} {mention}" } },
    function (response) {
        assert.strictEqual(response, "@TESTUSER @TESTUSER @TESTUSER @TESTUSER", "Custom failure message not populating correctly");
    }
);