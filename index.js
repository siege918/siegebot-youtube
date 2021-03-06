var http = require('https');

module.exports = {
	search: search,
	description: "Searches for a Youtube video based on your message.",
	arguments: "<your video search here>"
}

function search(message, config)
{
	return new Promise(function(resolve) {
		searchPromise(message, config, resolve);
	});
}

function searchPromise(message, config, callback) {
	var query = message.content.substring(message.content.indexOf(' ')).trim().replace(/ /g, "%20");
	http.get({
			host: "www.googleapis.com",
			path: "/youtube/v3/search?part=snippet&maxResults=1&type=video&key=" + config.key + "&q=" + query
		},
		function(response) {
			var body = '';
			response.on("data",
				function(d) {
					body += d;
				}
			);
			response.on("end", function() {
				var data = JSON.parse(body);
				var responseText = "";
				if (data["items"] && data["items"][0] && data["items"][0]["id"] && data["items"][0]["id"]["videoId"])
				{
                    responseText = config.successMessage;

                    if (!responseText)
                    {
                        responseText = "{mention}, {videoLink}";
                    }

                    responseText = responseText.replace(/{mention}/gm, message.author.toString())
                    	.replace(/{videoLink}/gm, "https://www.youtube.com/watch?v=" + data["items"][0]["id"]["videoId"]);

					message.channel.send(responseText);
				}
				else
				{
                    responseText = config.failureMessage;

                    if (!responseText)
                    {
                        responseText = "Sorry, {mention}, I couldn't find a video for that...";
                    }

					responseText = responseText.replace(/{mention}/gm, message.author.toString());
					
					message.channel.send(responseText);
				}

				if (callback)
				{
					callback(responseText);
				}
			});
		});
}