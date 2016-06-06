(function () {
	angular
		.module("WebAppMaker")
		.factory("WebsiteService", WebsiteService);

	// Definition of WebsiteService with its API
	function WebsiteService($http) {
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
			website['developerId'] = userId;
			return $http.post("/api/user/" + userId + "/website", website);
		}

		function findWebsiteById(websiteId) {
			console.log("findWebsiteById - " + websiteId);
			return $http.get("/api/website/" + websiteId);
		}

		function findWebsitesByUser(userId) {
			console.log("findWebsiteByUser - " + userId);
			return $http.get("/api/user/" + userId + "/website");
		}

		function updateWebsite(websiteId, website) {
			console.log("updateWebsite - ", websiteId);
			return $http.put("/api/website/" + websiteId, website)
		}

		function deleteWebsite(websiteId) {
			console.log("deleteWebsite - " + websiteId);
			return $http.delete("/api/website/" + websiteId);
		}
	}
})();
