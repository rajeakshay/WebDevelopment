module.exports = function(db, mongoose) {
	var PageSchema = require("./page.schema.server.js")(mongoose);
	var Page = mongoose.model("Page", PageSchema);

	return {
		createPage: createPage,
		findAllPagesForWebsite: findAllPagesForWebsite,
		findPageById: findPageById,
		updatePage: updatePage,
		deletePage: deletePage
	};

	function createPage(websiteId, page){
		page.websiteId = websiteId;
		return Page.create(page);
	}

	function findAllPagesForWebsite(websiteId){
		return Page.find({websiteId: websiteId});
	}

	function findPageById(pageId){
		return Page.findById(pageId);
	}

	function updatePage(id, newPage){
		delete newPage._id;
		return Page
			.update({_id: id}, {
				$set: {
					name: newPage.name,
					title: newPage.title
				}
			});
	}

	function deletePage(id){
		return Page.remove({_id: id});
	}

};
