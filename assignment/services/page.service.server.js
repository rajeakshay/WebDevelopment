module.exports = function(app, models) {
	var pageModel = models.pageModel;
	var websiteModel = models.websiteModel;

	app.post("/api/website/:websiteId/page", createPage);
	app.get("/api/website/:websiteId/page", findAllPagesForWebsite);
	app.get("/api/page/:pageId", findPageById);
	app.put("/api/page/:pageId", updatePage);
	app.delete("/api/page/:pageId", deletePage);
	
	function createPage(req, res){
		var wId = req.params.websiteId;
		var page = req.body;
		pageModel
			.createPage(wId, page)
			.then(function(page){
				res.json(page);
				return page;
			}, function (error){
				res.sendStatus(404);
			}).then(function (page){
			pushPagesForWebsite(websiteId, page._id);
		}, function (error){
			console.log("Error in creating page");
		});
	}

	function pushPagesForWebsite(websiteId, pageId){
		websiteModel
			.findWebsiteById(websiteId)
			.then(function (website){
				website.pages.push(pageId);
				website.save();
			}, function (error){
				console.log("Error finding website.");
			});
	}

	function findAllPagesForWebsite(req, res){
		var wId = req.params.websiteId;
		pageModel
			.findAllPagesForWebsite(wId)
			.then(function (pages){
				res.json(pages);
			}, function(error){
				res.sendStatus(404);
			});
	}

	function findPageById(req, res){
		var pId = req.params.pageId;
		pageModel
			.findPageById(pId)
			.then(function (page){
				res.json(page);
			}, function (error){
				res.sendStatus(404);
			});
	}

	function updatePage(req, res){
		var pId = req.params.pageId;
		var newPage = req.body;
		pageModel
			.updatePage(pId, newPage)
			.then(function (stats){
				res.sendStatus(200);
			}, function (error){
				res.sendStatus(404);
			});
	}

	function deletePage(req, res){
		var pId = req.params.pageId;
		pageModel
			.findPageById(pId)
			.then(function (page){
				removePageIdFromWebsites(page.websiteId, pId);
				return pId;
			}, function (error){
				console.log("deletePage error!");
			}).then(function (pgId){
			pageModel
				.deletePage(pgId)
				.then(function (stats){
					res.sendStatus(200);
					return pgId;
				}, function (error){
					res.sendStatus(404);
				});
		});
	}

	function removePageIdFromWebsites(websiteId, pageId){
		websiteModel
			.findWebsiteById(websiteId)
			.then(function (website){
				var idx = website.pages.indexOf(pageId);
				if(idx > -1){
					website.pages.splice(idx,1 );
					website.save();
				}
				else{
					console.log("Index not found");
				}
			}, function (error){
				console.log("Error in removing pageId from websites");
			});
	}
};
