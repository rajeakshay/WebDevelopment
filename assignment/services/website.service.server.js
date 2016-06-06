module.exports = function(app) {
	// Initial list of websites
	var websites = [
		{"_id": "123", "name": "Facebook", "developerId": "456"},
		{"_id": "234", "name": "Tweeter", "developerId": "456"},
		{"_id": "456", "name": "Gizmodo", "developerId": "456"},
		{"_id": "567", "name": "Tic Tac Toe", "developerId": "123"},
		{"_id": "678", "name": "Checkers", "developerId": "123"},
		{"_id": "789", "name": "Chess", "developerId": "234"}
	];

	app.post("/api/user/:userId/website", createWebsite);
	app.get("/api/user/:userId/website", findAllWebsitesForUser);
	app.get("/api/website/:websiteId", findWebsiteById);
	app.put("/api/website/:websiteId", updateWebsite);
	app.delete("/api/website/:websiteId", deleteWebsite);

	function createWebsite(req, res) {
		var uId = req.params.userId;
		var website = req.body;
		for(var i in websites){
			if(websites[i].developerId === uId && websites[i].name === website.name){
				// Send error as website already exists
				res.sendStatus(400);
				return;
			}
		}
		// Create a website page only if does not exist
		website._id = (new Date()).getTime().toString();
		websites.push(website);
		res.send(websites);
	}

	function findAllWebsitesForUser(req, res){
		var userId = req.params.userId;
		var result = [];
		for(var w in websites) {
			if(websites[w].developerId === userId) {
				result.push(websites[w]);
			}
		}
		res.json(result);
	}

	function findWebsiteById(req, res){
		var wId = req.params.websiteId;
		for(var w in websites) {
			if(websites[w]._id === wId) {
				res.send(websites[w]);
				return;
			}
		}
		res.send({});
	}

	function updateWebsite(req, res){
		var wId = req.params.websiteId;
		var newWebsite = req.body;
		for(w in websites){
			if(websites[w]._id === wId){
				websites[w].name = newWebsite.name;
				websites[w].developerId = newWebsite.developerId;
				websites[w].description = newWebsite.description;
				// Send success code
				res.sendStatus(200);
				return;
			}
		}
		res.sendStatus(400);
	}

	function deleteWebsite(req, res){
		var wId = req.params.websiteId;
		for(var w in websites){
			if(websites[w]._id === wId){
				websites.splice(w, 1);
				res.sendStatus(200);
				return;
			}
		}
		res.sendStatus(400);
	}
};
