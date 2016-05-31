(function () {
	angular
		.module("WebAppMaker")
		.factory("UserService", UserService);

	// User ID counter which should increment when a new user is created
	var _userUniqueId = 500;

	// Default supported users
	var users = [
		{
			_id: "123",
			username: "alice",
			password: "alice",
			firstName: "Alice",
			lastName: "Wonder",
			email: "alice@wonderland.com"
		},
		{_id: "234", username: "bob", password: "bob", firstName: "Bob", lastName: "Marley", email: "bob@marley.com"},
		{
			_id: "345",
			username: "charly",
			password: "charly",
			firstName: "Charly",
			lastName: "Garcia",
			email: "charly@garcia.com"
		},
		{
			_id: "456",
			username: "jannunzi",
			password: "jannunzi",
			firstName: "Jose",
			lastName: "Annunzi",
			email: "jannunzi@gmail.com"
		}
	];

	// Definition of UserService with its API
	function UserService() {
		// Make the API available to the outside world
		return {
			createUser: createUser,
			findUserById: findUserById,
			findUserByUsername: findUserByUsername,
			findUserByCredentials: findUserByCredentials,
			updateUser: updateUser,
			deleteUser: deleteUser
		};

		// API for the UserService
		function createUser(newUser) {
			var id = -1;
			console.log("createUser - " + newUser.username);
			// Given username, password and verify password fields should not be blank
			if (!newUser.username || !newUser.password || !newUser.verifyPassword) {
				return id;
			}
			// Password and Verify Password fields should exactly match
			if (newUser.password === newUser.verifyPassword) {
				_userUniqueId += 1;
				var user = {
					_id: _userUniqueId.toString(),
					username: newUser.username,
					password: newUser.password
				};
				id = _userUniqueId;
				users.push(user);
			}
			console.log(newUser.username + " created with ID " + id);
			return id;
		}

		function findUserById(userId) {
			console.log("findUserById - ", userId);
			for (var i in users) {
				if (users[i]._id === userId) {
					console.log("Found user - " + users[i]);
					return users[i];
				}
			}
			console.log("User not found");
			return null;
		}

		function findUserByUsername(username) {
			console.log("findUserByName - ", username);
			for (var i in users) {
				if (users[i].username === username) {
					console.log("Found user - " + users[i]);
					return users[i];
				}
			}
			console.log("User not found");
			return null;
		}

		function findUserByCredentials(username, password) {
			console.log("findUserByCredentials (", username, password, ")");
			for (var i in users) {
				if (users[i].username === username &&
					users[i].password === password) {
					console.log("Found user - " + users[i]);
					return users[i];
				}
			}
			console.log("User not found");
			return null;
		}

		// updateUser can only update first name, last name and email address
		function updateUser(userId, user) {
			console.log("updateUser - " + userId);
			for (var i in users) {
				if (users[i]._id === userId) {
					users[i].firstName = user.firstName;
					users[i].lastName = user.lastName;
					users[i].email = user.email;
					console.log("User updated - " + users[i]);
					return true;
				}
			}
			console.log("User not found");
			return false;
		}

		function deleteUser(userId) {
			console.log("deleteUser - " + userId);
			for (var i in users) {
				if (users[i]._id === userId) {
					users.splice(i, 1);
					console.log("Deleted user with ID " + userId);
					return true;
				}
			}
			console.log("User not found");
			return false;
		}
	}
})();

