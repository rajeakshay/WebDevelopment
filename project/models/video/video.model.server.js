module.exports = function() {
	var mongoose = require("mongoose");
	var VideoSchema = require("./video.schema.server.js")();
	var Video = mongoose.model("Video", VideoSchema);

	return {
		createVideo: createVideo,
		findVideoById: findVideoById,
		findVideoByIdProjection: findVideoByIdProjection,
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

	function findVideoByIdProjection(videoId){
		return Video
			.aggregate([
				{$match: {_id: videoId}},
				{$project: {
					videoId: 1,
					title: 1,
					author: 1,
					description: 1,
					noOfFavs: {$size: "$favBy"}
				}}
			]);
	}

	function getPublicFeed(){
		return Video
			.aggregate([
				{$sort: { lastFavoriteAt: -1 }},
				{$limit: 200},
				{$project: {
					videoId: 1,
					title: 1,
					author: 1,
					description: 1,
					noOfFavs: {$size: "$favBy"}
				}}
			]);
	}

	function getUserFeed(user){
		return Video
			.aggregate([
				{$match: {favBy: {$in: user.following}}},
				{$sort: { lastFavoriteAt : -1}},
				{$limit: 200},
				{$project: {
					videoId: 1,
					title: 1,
					author: 1,
					description: 1,
					noOfFavs: {$size: "$favBy"}
				}}
			]);
	}

	function getFavoritesForUser(user){
		return Video
			.aggregate([
				{$match: {_id: {$in: user.favorites}}},
				{$sort: {_id: -1}},
				{$project: {
					videoId: 1,
					title: 1,
					author: 1,
					description: 1,
					noOfFavs: {$size: "$favBy"}
				}}
			]);
	}
};
