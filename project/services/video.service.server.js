module.exports = function(app, models) {
	var projectUserModel = models.projectUserModel;
	var videoModel = models.videoModel;

	app.post("/api/video", createVideo);
	app.get("/api/video/:videoId", getVideoById);
	app.get("/api/videoExists/:ytId", getVideoByVideoId);
	app.get("/api/video", getPublicFeed);
	app.put("/api/video/:videoId", updateVideo);
	app.delete("/api/video/:videoId", deleteVideo);
	app.get("/api/youtube", getYoutubeKey);

	function createVideo(req, res){
		var video = req.body;
		videoModel
			.findVideoByVideoId(video.videoId)
			.then(
				function (stats) {
					if(stats){
						res.status(400).send("Video already exists.");
					}
					else {
						videoModel
							.createVideo(video)
							.then(
								function(newVideo) {
									res.json(newVideo);
								},
								function (err) {
									res.status(400).send("Unable to create video.");
								});
					}
				}
			);
	}

	function getVideoById(req, res){
		var vId = req.params.videoId;
		videoModel
			.findVideoById(vId)
			.then(
				function(video){
					res.json(video);
				},
				function(err){
					res.status(400).send("Could not find the video.");
				}
			);
	}

	function getVideoByVideoId(req, res){
		var ytId = req.params.ytId;
		videoModel
			.findVideoByVideoId(ytId)
			.then(
				function(stats){
					if(stats){
						res.status(200).send("Video already exists.");
					}
					else{
						res.status(400).send("Video does not exist yet.");
					}
				}
			);
	}

	function getPublicFeed(req, res){
		videoModel
			.getPublicFeed()
			.then(
				function(feed){
					res.json(feed);
				},
				function(err){
					res.status(400).send("Could not fetch the public feed.");
				}
			);
	}

	function updateVideo(req, res){
		var vId = req.params.videoId;
		var newVideo = req.body;
		videoModel
			.updateVideo(vId, newVideo)
			.then(
				function(){
					res.status(200).send("Updated video.");
				},
				function(err){
					res.status(400).send("Could not update video.");
				}
			);
	}

	function deleteVideo(req, res){
		var vId = req.params.videoId;
		videoModel
			.deleteVideo(vId)
			.then(
				function(stats){
					res.status(200).send("Deleted user.");
				},
				function(err){
					res.status(400).send("Could not delete user.");
				}
			);
	}

	function getYoutubeKey(req, res){
		// Populate youtubeKey with your API key for Youtube Data API 3.0 to work on your local machine
		// OR
		// Set an environment variable named YOUTUBE_API_KEY with your API key
		var youtubeKey = "";
		if(process.env.YOUTUBE_API_KEY) {
			youtubeKey =  process.env.YOUTUBE_API_KEY; // Openshift server environment variable
		}
		res.send(youtubeKey);
	}
};
