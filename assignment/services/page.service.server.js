module.exports = function(app) {
	// Initial list of pages
	var pages =
		[
			{"_id": "321", "name": "Post 1", "websiteId": "456"},
			{"_id": "432", "name": "Post 2", "websiteId": "456"},
			{"_id": "543", "name": "Post 3", "websiteId": "456"}
		];

	app.post("/api/website/:websiteId/page", createPage);
	app.get("/api/website/:websiteId/page", findAllPagesForWebsite);
	app.get("/api/page/:pageId", findPageById);
	app.put("/api/page/:pageId", updatePage);
	app.delete("/api/page/:pageId", deletePage);
	
	function createPage(req, res){
		var wId = req.params.websiteId;
		var page = req.body;
		for(var i in pages){
			if(pages[i].websiteId === wId && pages[i].name === page.name){
				// Send error as page already exists
				res.sendStatus(400);
				return;
			}
		}
		// Create a new page only if does not exist
		page._id = (new Date()).getTime().toString();
		pages.push(page);
		res.send(page);
	}

	function findAllPagesForWebsite(req, res){
		var wId = req.params.websiteId;
		var results = [];
		for (var i in pages) {
			if (pages[i].websiteId === wId) {
				results.push(pages[i]);
			}
		}
		res.json(results);
	}

	function findPageById(req, res){
		var pId = req.params.pageId;
		for(var i in pages) {
			if(pages[i]._id === pId) {
				res.send(pages[i]);
				return;
			}
		}
		res.send({});
	}

	function updatePage(req, res){
		var pId = req.params.pageId;
		var newPage = req.body;
		for(var i in pages){
			if(pages[i]._id === pId){
				pages[i].name = newPage.name;
				pages[i].title = newPage.title;
				// Send success code
				res.sendStatus(200);
				return;
			}
		}
		// Invalid page id
		res.sendStatus(400);
	}

	function deletePage(req, res){
		var pId = req.params.pageId;
		for (var i in pages) {
			if (pages[i]._id === pageId) {
				pages.splice(i, 1);
				// Send success code
				res.sendStatus(200);
				return;
			}
		}
		// Invalid page id
		res.sendStatus(400);
	}
};
