module.exports = function(app, models) {
	var widgetModel = models.widgetModel;
	var pageModel = models.pageModel;

	var multer = require('multer');
	var upload = multer({ dest: __dirname+'/../../public/uploads' });

	app.post("/api/page/:pageId/widget", createWidget);
	app.put("/api/page/:pageId/widget", reorderWidgets);
	app.get("/api/page/:pageId/widget", findAllWidgetsForPage);
	app.get("/api/widget/:widgetId", findWidgetById);
	app.put("/api/widget/:widgetId", updateWidget);
	app.delete("/api/widget/:widgetId", deleteWidget);
	app.post ("/api/upload", upload.single('myFile'), uploadImage);
	app.get("/api/flickr", getFlickrKey);

	function createWidget(req, res){
		var pageId = req.params.pageId;
		var newWidget = req.body;
		widgetModel
			.findHighestOrder(pageId)
			.then(function (doc){
				var orderX = -1;
				if(doc && doc.order){
					orderX = doc.order + 1;
				}
				else{
					orderX = 1;
				}
				newWidget.order = orderX;
				return orderX;
			}, function (err){
				res.sendStatus(404);
			}).then(function (number){
			widgetModel
				.createWidget(pageId, newWidget)
				.then(function (widget){
					res.json(widget);
					return widget;
				}, function (error){
					res.statusCode(404).send(error);
				}).then(function (widget){
				pushWidgetsInPage(pageId, widget._id);
			}, function (error){
				console.log("Error creating widget.");
			});
		});
	}

	function pushWidgetsInPage(pageId, widgetId){
		pageModel
			.findPageById(pageId)
			.then(function (page){
				page.widgets.push(widgetId);
				page.save();
			}, function (error){
				console.log("Error in pushing widgets to page.");
			});
	}

	function findAllWidgetsForPage(req, res){
		var pageId = req.params.pageId;
		widgetModel
			.findAllWidgetsForPage(pageId)
			.then(function (widgets){
				res.json(widgets);
			}, function (error){
				console.log("Error finding widgets for page.");
			});
	}

	function findWidgetById(req, res){
		var widgetId = req.params.widgetId;
		widgetModel
			.findWidgetById(widgetId)
			.then(function (widget) {
				res.json(widget);
			}, function (error){
				res.sendStatus(404);
			});
	}

	function updateWidget(req, res){
		var widgetId = req.params.widgetId;
		var newWidget = req.body;
		widgetModel
			.updateWidget(widgetId, newWidget)
			.then(function(stats){
				newWidget._id = widgetId;
				res.json(newWidget);
			}, function(error){
				res.sendStatus(404);
			});
	}

	function deleteWidget(req, res){
		var widgetId = req.params.widgetId;
		widgetModel
			.findWidgetById(widgetId)
			.then(function (widget){
				removeWidgetIdFromPages(widget.pageId, widgetId);
				return widgetId;
			}, function (error){
				console.log("Error deleting widget");
			}).then(function (widgetId){
			widgetModel
				.deleteWidget(widgetId)
				.then(function (stats) {
					res.sendStatus(200);
					return widgetId;
				} , function (error) {
					res.sendStatus(404);
				});
		});
	}

	function removeWidgetIdFromPages(pageId, widgetId){
		pageModel
			.findPageById(pageId)
			.then(function (page){
				var idx = page.widgets.indexOf(widgetId);
				if(idx > -1){
					page.widgets.splice(idx,1);
					page.save();
				}
				else{
					console.log("Index not found.");
				}
			}, function (error){
				console.log("Error removing widget from page");
			});
	}

	function uploadImage(req, res) {
		var widgetId = req.body.widgetId;
		var pageId = req.body.pageId;
		var userId = req.body.userId;
		var websiteId = req.body.userId;

		var width = req.body.width;
		var myFile = req.file;

		if(myFile) {
			var originalname = myFile.originalname; // file name on user's computer
			var filename = myFile.filename;     // new file name in upload folder
			var path = myFile.path;         // full path of uploaded file
			var destination = myFile.destination;  // folder where file is saved to
			var size = myFile.size;
			var mimetype = myFile.mimetype;

			var newWidget = req.body;
			if(width == ''){
				width = "100%";
			}
			newWidget.width = width;
			newWidget.name = req.body.name;
			newWidget.text = req.body.text;
			newWidget.pageId = pageId.toString();
			newWidget.widgetType = "IMAGE";
			newWidget.url = "/uploads/" + filename;

			if(newWidget._id){
				widgetModel
					.updateWidget(newWidget._id, newWidget)
					.then(function(stats){
						res.sendStatus(200);
					}, function(error){
						res.sendStatus(404);
					});
				res.redirect("/assignment/#/user/"+userId+"/website/"+websiteId+"/page/"+pageId+"/widget/" + newWidget._id);
			}
			else{
				delete newWidget._id;
				widgetModel
					.findHighestOrder(pageId)
					.then(function (doc){
						var orderX = -1;
						if(doc && doc.order){
							orderX = doc.order + 1;
						}
						else{
							orderX = 1;
						}
						newWidget.order = orderX;
						return orderX;
					}, function (err){
						res.sendStatus(404);
					})
					.then(function(number) {
					widgetModel
						.createWidget(newWidget.pageId, newWidget)
						.then(function (widget) {
							newWidget._id = widget._id;
							res.redirect("/assignment/#/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget/" + widget._id);
						}, function (error) {
							console.log("Error creating widget.");
						});
				});
			}
		}
		else {
			res.redirect("/assignment/#/user/"+userId+"/website/"+websiteId+"/page/"+pageId+"/widget/" + widgetId);
		}
	}

	function reorderWidgets(req, res){
		var pageId = req.params.pageId;
		var start = req.query.start;
		var end   = req.query.end;
		widgetModel
			.reorderWidgets(pageId, start, end)
			.then(function(widgets){
				res.sendStatus(200);
			});
	}

	function getFlickrKey(req, res){
		// Populate flickrKey with your API key for Flickr Photo Search to work on your local machine
		// OR
		// Set an environment variable named FLICKR_API_KEY with your API Key
		var flickrKey = "";
		if(process.env.FLICKR_API_KEY) {
			flickrKey =  process.env.FLICKR_API_KEY; // Openshift server environment variable
		}
		res.send(flickrKey);
	}
};

