(function () {
	angular
		.module("WebAppMaker")
		.factory("UserService", UserService);

	// Definition of UserService with its API
	function UserService($http) {
		// Make the API available to the outside world
		return {
			registerUser: registerUser,
			createUser: createUser,
			login: login,
			logout: logout,
			loggedIn: loggedIn,
			findUserById: findUserById,
			findUserByUsername: findUserByUsername,
			findUserByCredentials: findUserByCredentials,
			updateUser: updateUser,
			deleteUser: deleteUser
		};

		// API for the UserService

		function login(username, password){
			var user = {
				username: username,
				password: password
			};
			console.log(user);
			return $http.post("/api/login",user);
		}

		function logout(){
			return $http.post("/api/logout");
		}

		function loggedIn(){
			return $http.get("/api/loggedIn");
		}

		function registerUser(newUser) {
			console.log("createUser - " + newUser.username);
			return $http.post("/api/register", newUser);
		}

		function createUser(newUser) {
			console.log("createUser - " + newUser.username);
			return $http.post("/api/user", newUser);
		}

		function findUserById(userId) {
			console.log("findUserById - ", userId);
			var requestUrl = "/api/user/" + userId;
			return $http.get(requestUrl);
		}

		function findUserByUsername(username) {
			console.log("findUserByName - ", username);
			var requestUrl = "/api/user?username=" + username;
			return $http.get(requestUrl);
		}

		function findUserByCredentials(username, password) {
			console.log("findUserByCredentials (", username, password, ")");
			var requestUrl = "/api/user?username=" + username + "&password=" + password;
			return $http.get(requestUrl);
		}

		function updateUser(userId, user) {
			console.log("updateUser - " + userId);
			var requestUrl = "/api/user/" + userId;
			return $http.put(requestUrl, user);
		}

		function deleteUser(userId) {
			console.log("deleteUser - " + userId);
			var requestUrl = "/api/user/" + userId;
			return $http.delete(requestUrl);
		}
	}
})();

