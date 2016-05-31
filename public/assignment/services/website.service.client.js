(function () {
	angular
		.module("WebAppMaker")
		.factory("WebsiteService", WebsiteService);

	// Website ID counter which should increment when a new website is created
	var _userWebsiteId = 800;

	// Initial list of websites
	var websites = [
		{"_id": "123", "name": "Facebook", "developerId": "456"},
		{"_id": "234", "name": "Tweeter", "developerId": "456"},
		{"_id": "456", "name": "Gizmodo", "developerId": "456"},
		{"_id": "567", "name": "Tic Tac Toe", "developerId": "123"},
		{"_id": "678", "name": "Checkers", "developerId": "123"},
		{"_id": "789", "name": "Chess", "developerId": "234"}
	];

	// Definition of WebsiteService with its API
	function WebsiteService() {
		// Make the API available to the outside world
		return {
			createWebsite: createWebsite,
			findWebsitesByUser: findWebsitesByUser,
			findWebsiteById: findWebsiteById,
			updateWebsite: updateWebsite,
			deleteWebsite: deleteWebsite
		};

		function createWebsite(userId, website) {
			console.log("createWebsite for user ID - ", userId);
			_userWebsiteId += 1;
			website['_id'] = _userWebsiteId.toString();
			website['developerId'] = userId;
			websites.push(website);
			return website;
		}

		function findWebsiteById(websiteId) {
			console.log("findWebsiteById - " + websiteId);
			for (var i in websites) {
				if (websites[i]._id == websiteId) {
					console.log("Found website -" + websites[i]);
					return websites[i];
				}
			}
			console.log("Website not found");
			return false;
		}

		function findWebsitesByUser(userId) {
			console.log("findWebsiteByUser - " + userId);
			var resultSet = [];
			for (var i in websites) {
				if (websites[i].developerId == userId) {
					resultSet.push(websites[i]);
				}
			}
			console.log("Found " + resultSet.length + " websites for user ID " + userId);
			return resultSet;
		}

		function updateWebsite(websiteId, website) {
			console.log("updateWebsite - ", websiteId);
			var oldWebsite = findWebsiteById(websiteId);
			if (oldWebsite) {
				oldWebsite.name = website.name;
				oldWebsite.developerId = website.developerId;
				oldWebsite.description = website.description;
				console.log("Website updated -" + oldWebsite);
				return true;
			}
			return false;
		}

		function deleteWebsite(websiteId) {
			console.log("deleteWebsite - " + websiteId);
			for (var i in websites) {
				if (websites[i]._id === websiteId) {
					websites.splice(i, 1);
					console.log("Deleted website with ID " + websiteId);
					return true;
				}
			}
			console.log("Website not found");
			return false;
		}
	}
})();
