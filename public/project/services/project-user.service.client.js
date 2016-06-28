(function(){
	angular
		.module("iTube")
		.factory("ProjectUserService", ProjectUserService);

	function ProjectUserService($http){
		return {
			signup: signup,
			signin: signin,
			signout: signout,
			loggedIn: loggedIn,
			createUser: createUser,
			findUserById: findUserById,
			getAllUsers: getAllUsers,
			getUserFeed: getUserFeed,
			getFavoritesForUser: getFavoritesForUser,
			getFollowersForUser: getFollowersForUser,
			getFollowingForUser: getFollowingForUser,
			addToFavorite: addToFavorite,
			addToFollowers: addToFollowers,
			addToFollowing: addToFollowing,
			removeFromFavorites: removeFromFavorites,
			removeFromFollowers: removeFromFollowers,
			removeFromFollowing: removeFromFollowing,
			updateUser: updateUser,
			deleteUser: deleteUser
		};

		function signin(email, password){
			var user = {
				email: email,
				password: password
			};
			console.log("signin - ", user);
			return $http.post("/api/login",user);
		}

		function signout(){
			return $http.post("/api/logout");
		}

		function loggedIn(){
			return $http.get("/api/loggedIn");
		}

		function signup(newUser) {
			console.log("signup - " + newUser.email);
			return $http.post("/api/register", newUser);
		}

		function createUser(newUser){
			console.log("createUser - " + newUser.email);
			return $http.post("/api/user", newUser);
		}

		function findUserById(userId){
			console.log("findUserById - ", userId);
			return $http.get("/api/user/" + userId);
		}

		function getAllUsers(){
			console.log("getAllUsers -");
			return $http.get("/api/user");
		}

		function getUserFeed(userId){
			console.log("getUserFeed - ", userId);
			return $http.get("/api/user/"+ userId +"/feed");
		}

		function getFavoritesForUser(userId){
			console.log("getFavoritesForUser - ", userId);
			return $http.get("/api/user/"+ userId +"/favorites");
		}

		function getFollowersForUser(userId){
			console.log("getFollowersForUser - ", userId);
			return $http.get("/api/user/"+ userId +"/followers");
		}

		function getFollowingForUser(userId){
			console.log("getFollowingForUser - ", userId);
			return $http.get("/api/user/"+ userId +"/following");
		}

		function updateUser(userId, user){
			console.log("updateUser - " + userId);
			return $http.put("/api/user/" + userId, user);
		}

		function addToFavorite(userId, video){
			console.log("addToFavorite - " + userId + " " + video._id);
			return $http.put("/api/user/" + userId + "/favorites", video);
		}

		function deleteUser(userId){
			console.log("deleteUser - " + userId);
			return $http.delete("/api/user/" + userId);
		}

		function addToFollowers(userId, follower){
			console.log("addToFollowers - " + userId + " " + follower._id);
			return $http.put("/api/user/"+ userId +"/followers", follower);
		}

		function addToFollowing(userId, following){
			console.log("addToFollowing - " + userId + " " + following._id);
			return $http.put("/api/user/"+ userId +"/following", following);
		}

		function removeFromFavorites(userId, videoId){
			console.log("removeFromFavorites - " + userId + " " + videoId);
			return $http.delete("/api/user/"+ userId +"/favorites?videoId="+videoId);
		}

		function removeFromFollowers(userId, followerId){
			console.log("removeFromFollowers - " + userId + " " + followerId);
			return $http.delete("/api/user/"+ userId +"/followers?followerId="+followerId);
		}

		function removeFromFollowing(userId, followingId){
			console.log("removeFromFollowing - " + userId + " " + followingId);
			return $http.delete("/api/user/"+userId+"/following?followingId="+followingId);
		}
	}
})();