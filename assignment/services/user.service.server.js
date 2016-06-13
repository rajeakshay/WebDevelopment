module.exports = function(app, models) {
	var userModel = models.userModel;

	app.post("/api/user", createUser);
	app.get("/api/user", getUsers);
	app.get("/api/user/:userId", findUserById);
	app.put("/api/user/:userId", updateUser);
	app.delete("/api/user/:userId", deleteUser);

	function createUser(req, res) {
		var user = req.body;
		userModel
			.createUser(user)
			.then(function (user) {
				res.send(user);
			}, function(error){
				res.sendStatus(400);
			});
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
		userModel.findUserByUsername(username)
			.then(function (user){
				res.json(user);
			}, function (error){
				res.sendStatus(404);
			});
	}

	function findUserByCredentials(username, password, res) {
		userModel.findUserByCredentials(username, password)
			.then(function (user){
				res.json(user);
			}, function (err){
				res.sendStatus(404);
			});
	}

	function findUserById(req, res) {
		var id = req.params.userId;
		userModel
			.findUserById(id)
			.then(function (user){
				res.send(user);
			}, function (error){
				res.sendStatus(404);
			});
	}

	function updateUser(req, res) {
		var id = req.params.userId;
		var newUser = req.body;
		userModel
			.updateUser(id, newUser)
			.then(function(stats){
				res.sendStatus(200);
			}, function(error) {
				res.sendStatus(404);
			});
	}

	function deleteUser(req, res) {
		var id = req.params.userId;
		userModel
			.deleteUser(id)
			.then(function (stats){
				res.sendStatus(200);
			}, function (error){
				res.sendStatus(404);
			});
	}
};