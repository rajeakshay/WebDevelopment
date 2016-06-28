module.exports = function() {
	var mongoose = require("mongoose");
	var VideoSchema = require("./video.schema.server.js")();
	var Video = mongoose.model("Video", VideoSchema);

	return {
		createVideo: createVideo,
		findVideoById: findVideoById,
		findVideoByVideoId: findVideoByVideoId,
		addFavoriteBy: addFavoriteBy,
		removeFavoriteBy: removeFavoriteBy,
		removeAllFavoritesBy: removeAllFavoritesBy,
		getPublicFeed: getPublicFeed,
		getUserFeed: getUserFeed,
		getFavoritesForUser: getFavoritesForUser,
		updateVideo: updateVideo,
		deleteVideo: deleteVideo
	};

	function createVideo(video) {
		return Video.create(video);
	}

	function updateVideo(videoId, video) {
		delete video._id;
		return Video
			.update({_id: videoId},{
				$set: {
					title: video.title,
					description: video.description,
					author: video.author,
					favBy: video.favBy
				}
			});
	}

	function addFavoriteBy(videoId, userId){
		return Video
			.update({_id: videoId}, {
				$push: {favBy: userId},
				$currentDate: {lastFavoriteAt: true}
			});
	}

	function removeFavoriteBy(videoId, userId){
		return Video
			.update({_id: videoId}, {
				$pull: {favBy: userId}
			});
	}

	function removeAllFavoritesBy(user) {
		return Video
			.update(
				{_id: {$in: user.favorites}},
				{$pull: {favBy: user._id}},
				{ multi: true });
	}

	function deleteVideo(videoId) {
		return Video.remove({_id: videoId});
	}

	function findVideoById(videoId) {
		return Video.findById(videoId);
	}

	function findVideoByVideoId(videoId){
		return Video.findOne({videoId: videoId});
	}

	function getPublicFeed(){
		return Video.find();
	}

	function getUserFeed(user){
		return Video.find({favBy: {$in: user.following}});
	}

	function getFavoritesForUser(user){
		return Video.find({_id: {$in: user.favorites}});
	}
};
