(function () {
	angular
		.module("WebAppMaker")
		.factory("PageService", PageService);

	// Page ID counter which should increment when a new page is created
	var _userPageId = 600;

	// Initial list of pages
	var pages =
		[
			{"_id": "321", "name": "Post 1", "websiteId": "456"},
			{"_id": "432", "name": "Post 2", "websiteId": "456"},
			{"_id": "543", "name": "Post 3", "websiteId": "456"}
		];

	// Definition of PageService with its API
	function PageService() {
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
			_userPageId += 1;
			var newPage = {
				_id: _userPageId.toString(),
				name: page.name,
				title: page.title,
				websiteId: websiteId
			};
			pages.push(newPage);
			console.log("New page created with ID " + newPage._id);
			return true;
		}

		function findPageByWebsiteId(websiteId) {
			var results = [];
			console.log("findPageByWebsiteId - " + websiteId);
			for (var i in  pages) {
				if (pages[i].websiteId === websiteId) {
					results.push(pages[i]);
				}
			}
			console.log("Found " + results.length + " pages for website ID " + websiteId);
			return results;
		}

		function findPageById(pageId) {
			console.log("findPageById - " + pageId);
			for (var i in pages) {
				if (pages[i]._id === pageId) {
					console.log("Found page - " + pages[i]);
					return pages[i];
				}
			}
			console.log("Page not found");
			return false;
		}

		function updatePage(pageId, newPage) {
			console.log("updatePage - " + pageId);
			var oldPage = findPageById(pageId);
			if (oldPage) {
				oldPage.name = newPage.name;
				oldPage.title = newPage.title;
				console.log("Page updated -" + oldPage);
				return true;
			}
			return false;
		}

		function deletePage(pageId) {
			console.log("deletePage - " + pageId);
			for (var i in pages) {
				if (pages[i]._id === pageId) {
					pages.splice(i, 1);
					console.log("Deleted page with ID " + pageId);
					return true;
				}
			}
			console.log("Page not found");
			return false;
		}

	}
})();