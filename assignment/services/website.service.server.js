module.exports = function(app, models) {
	var websiteModel = models.websiteModel;
	var userModel = models.userModel;

	app.post("/api/user/:userId/website", createWebsite);
	app.get("/api/user/:userId/website", findAllWebsitesForUser);
	app.get("/api/website/:websiteId", findWebsiteById);
	app.put("/api/website/:websiteId", updateWebsite);
	app.delete("/api/website/:websiteId", deleteWebsite);

	function createWebsite(req, res) {
		var userId = req.params.userId;
		var newWebsite = req.body;
		websiteModel
			.createWebsite(userId, newWebsite)
			.then(function (website){
				res.json(website);
				return website;
			}, function (error){
				console.log(error);
			}).then(function (website){
			pushWebsitesForUser(userId, website._id);
		}, function (error){
			console.log("Error creating website.");
		});
	}

	function pushWebsitesForUser(userId, websiteId){
		userModel
			.findUserById(userId)
			.then(function (user){
				user.websites.push(websiteId);
				user.save();
			}, function (error){
				console.log("Error pushing websites for user.");
			});
	}

	function findAllWebsitesForUser(req, res){
		var userId = req.params.userId;
		websiteModel
			.findAllWebsitesForUser(userId)
			.then(function(websites) {
				res.json(websites);
			}, function (error){
				res.sendStatus(404);
			});
	}

	function findWebsiteById(req, res){
		var wId = req.params.websiteId;
		websiteModel
			.findWebsiteById(wId)
			.then(function(website) {
				res.json(website);
			}, function (error){
				res.sendStatus(404);
			});
	}

	function updateWebsite(req, res){
		var id = req.params.websiteId;
		var newWebsite = req.body;
		websiteModel
			.updateWebsite(id, newWebsite)
			.then(function (stats){
				res.sendStatus(200);
			}, function(error){
				res.sendStatus(404);
			});
	}

	function deleteWebsite(req, res){
		var id = req.params.websiteId;
		websiteModel
			.findWebsiteById(id)
			.then(function (website){
				removeWebsiteFromUser(website.developerId, id);
				return id;
			}, function (error){
				console.log("Error removing website from user.");
			}).then(function (id){
			websiteModel
				.deleteWebsite(id)
				.then(function (stats){
					res.sendStatus(200);
					return id;
				}, function(error){
					res.sendStatus(404);
				});
		});
	}

	function removeWebsiteFromUser(developerId, websiteId){
		userModel
			.findUserById(developerId)
			.then(function (user){
				var idx = user.websites.indexOf(websiteId);
				if(idx > -1){
					user.websites.splice(idx, 1);
					user.save();
				}
				else{
					console.log("Index not found");
				}
			}, function (error){
				console.log("Error removing website from user");
			})
	}
};
