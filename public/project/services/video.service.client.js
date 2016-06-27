(function(){
	angular
		.module("iTube")
		.factory("VideoService", VideoService);

	function VideoService($http){
		return {
			createVideo: createVideo,
			getVideoById: getVideoById,
			getVideoByVideoId: getVideoByVideoId,
			getPublicFeed: getPublicFeed,
			updateVideo: updateVideo,
			deleteVideo: deleteVideo
		};

		function createVideo(newVideo){
			console.log("createVideo - " + newVideo._id);
			return $http.post("/api/video", newVideo);
		}

		function updateVideo(videoId, newVideo){
			console.log("updateVideo - " + newVideo._id);
			return $http.put("/api/video/"+ videoId, newVideo);
		}

		function deleteVideo(videoId){
			console.log("deleteVideo - " + videoId);
			return $http.delete("/api/video/" + videoId);
		}

		function getPublicFeed(){
			return $http.get("/api/video/publicfeed");
		}

		function getVideoById(videoId){
			return $http.get("/api/video/"+videoId);
		}

		function getVideoByVideoId(ytId){
			return $http.get("/api/video/"+ytId);
		}
	}
})();
