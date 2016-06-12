module.exports = function(app) {
	// Initialize a list of widgets
	var widgets = [
		{"_id": "123", "widgetType": "HEADER", "pageId": "321", "size": 2, "text": "GIZMODO"},
		{"_id": "234", "widgetType": "HEADER", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
		{
			"_id": "345", "widgetType": "IMAGE", "pageId": "321", "width": "100%",
			"url": "http://lorempixel.com/400/200/"
		},
		{
			"_id": "456",
			"widgetType": "HTML",
			"pageId": "321",
			"text": '<p class="first-text">Investing in undersea internet cables has been a <a href="http://gizmodo.com/why-more-technology-giants-are-paying-to-lay-their-own-1703904291">big part of data strategy </a>plans for tech giants in recent years. Now Microsoft and Facebook are teaming up for the mother of all cables: A 4,100-mile monster that can move 160 Tbps, which will make it the highest-capacity cable on Earth. The cable even has a name, MAREA, and it will break ground (break waves?) later this year. Hopefully it can handle all your selfies.</p>'
		},
		{"_id": "567", "widgetType": "HEADER", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
		{
			"_id": "678", "widgetType": "YOUTUBE", "pageId": "321", "width": "100%",
			"url": "https://youtu.be/AM2Ivdi9c4E"
		},
		{"_id": "789", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum</p>"}
	];

	var multer = require('multer');
	var upload = multer({ dest: __dirname+'/../../public/uploads' });

	app.post("/api/page/:pageId/widget", createWidget);
	app.get("/api/page/:pageId/widget", findAllWidgetsForPage);
	app.get("/api/widget/:widgetId", findWidgetById);
	app.put("/api/widget/:widgetId", updateWidget);
	app.delete("/api/widget/:widgetId", deleteWidget);
	app.post ("/api/upload", upload.single('myFile'), uploadImage);
	app.get("/api/flickr", getFlickrKey);

	function createWidget(req, res){
		var pId = req.params.pageId;
		var widget = req.body;
		widget._id = (new Date()).getTime().toString();
		widgets.push(widget);
		res.send(widget);
	}

	function findAllWidgetsForPage(req, res){
		var pId = req.params.pageId;
		var results = [];
		for (var i in widgets){
			if(widgets[i].pageId === pId){
				results.push(widgets[i]);
			}
		}
		res.json(results);
	}

	function findWidgetById(req, res){
		var wId = req.params.widgetId;
		for(var i in widgets){
			if(widgets[i]._id === wId){
				res.send(widgets[i]);
				return;
			}
		}
		res.send({});
	}

	function updateWidget(req, res){
		var wId = req.params.widgetId;
		var newWidget = req.body;
		for(var i in widgets){
			if(widgets[i]._id === wId){
				widgets[i] = newWidget;
				res.sendStatus(200);
				return;
			}
		}
		res.sendStatus(400);
	}

	function deleteWidget(req, res){
		var wId = req.params.widgetId;
		for(var i in widgets){
			if(widgets[i]._id === wId){
				widgets.splice(i, 1);
				res.sendStatus(200);
				return;
			}
		}
		res.sendStatus(400);
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

			for (var i in widgets) {
				if (widgets[i]._id === widgetId) {
					widgets[i].url = "/uploads/" + filename;
					widgets[i].width = width;
				}
			}
			res.redirect("/assignment/#/user/"+userId+"/website/"+websiteId+"/page/"+pageId+"/widget/" + widgetId);

		} else {
			res.redirect("/assignment/#/user/"+userId+"/website/"+websiteId+"/page/"+pageId+"/widget/" + widgetId);
		}
	}

	function getFlickrKey(req, res){
		// Populate flickrKey with your API key for Flickr Photo Search to work on your local machine
		var flickrKey = "";
		if(process.env.FLICKR_API_KEY) {
			flickrKey =  process.env.FLICKR_API_KEY; // Openshift server environment variable
		}
		res.send(flickrKey);
	}
};
