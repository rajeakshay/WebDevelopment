module.exports = function(app) {
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

	app.post("/api/user", createUser);
	app.get("/api/user", getUsers);
	app.get("/api/user/:userId", findUserById);
	app.put("/api/user/:userId", updateUser);
	app.delete("/api/user/:userId", deleteUser);

	// Handle POST call to register new users
	function createUser(req, res) {
		var user = req.body;
		user._id = (new Date()).getTime().toString();
		users.push(user);
		res.send(user);
	}

	function getUsers(req, res) {
		var username = req.query.username;
		var password = req.query.password;

		if(username && password) {
			// Look for a user with given credentials
			findUserByCredentials(username, password, res);
		} else if(username) {
			// Look for a user with given username
			findUserByUsername(username, res);
		} else {
			// Send all users
			res.send(users);
		}
	}

	function findUserByUsername(username, res) {
		for(var i in users) {
			if(users[i].username === username) {
				res.send(users[i]);
				return;
			}
		}
		// Send blank response if no user found
		res.send({});
	}

	function findUserByCredentials(username, password, res) {
		for(var i in users) {
			if(users[i].username === username && users[i].password === password) {
				res.send(users[i]);
				return;
			}
		}
		// Send blank response if no user found
		res.send({});
	}

	function findUserById(req, res) {
		var id = req.params.userId;
		for(var i in users) {
			if(users[i]._id === id) {
				res.send(users[i]);
				return;
			}
		}
		res.send({});
	}

	function updateUser(req, res) {
		var id = req.params.userId;
		var newUser = req.body;
		for(var i in users) {
			if(users[i]._id === id) {
				users[i].firstName = newUser.firstName;
				users[i].lastName = newUser.lastName;
				users[i].email = newUser.email;
				// Send success code
				res.sendStatus(200);
				return;
			}
		}
		// Send 400 if an invalid user was given
		res.sendStatus(400);
	}

	function deleteUser(req, res) {
		var id = req.params.userId;
		for(var i in users) {
			if (users[i]._id === id) {
				users.splice(i, 1);
				// Send success code
				res.sendStatus(200);
				return;
			}
		}
		// Send 400 if an invalid user was given
		res.sendStatus(400);
	}
};