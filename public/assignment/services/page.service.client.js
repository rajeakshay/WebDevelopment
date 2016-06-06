(function () {
	angular
		.module("WebAppMaker")
		.factory("PageService", PageService);

	// Definition of PageService with its API
	function PageService($http) {
		// Make the API available to the outside world
		return {
			createPage: createPage,
			findPageByWebsiteId: findPageByWebsiteId,
			findPageById: findPageById,
			updatePage: updatePage,
			deletePage: deletePage
		};

		function createPage(websiteId, page) {
			console.log("createPage - (" + websiteId + ", " + page + ")");
			var newPage = {
				name: page.name,
				title: page.title,
				websiteId: websiteId
			};
			return $http.post("/api/website/" + websiteId + "/page", newPage);
		}

		function findPageByWebsiteId(websiteId) {
			console.log("findPageByWebsiteId - " + websiteId);
			return $http.get("/api/website/" + websiteId + "/page");
		}

		function findPageById(pageId) {
			console.log("findPageById - " + pageId);
			return $http.get("/api/page/" + pageId);
		}

		function updatePage(pageId, newPage) {
			console.log("updatePage - " + pageId);
			return $http.put("/api/page/" + pageId, newPage);
		}

		function deletePage(pageId) {
			console.log("deletePage - " + pageId);
			return $http.delete("/api/page/" + pageId);
		}
	}
})();