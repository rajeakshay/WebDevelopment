module.exports = function(db, mongoose) {
	var WebsiteSchema = require("./website.schema.server.js")(mongoose);
	var Website = mongoose.model("Website", WebsiteSchema);

	return {
		createWebsite: createWebsite,
		findAllWebsitesForUser: findAllWebsitesForUser,
		findWebsiteById: findWebsiteById,
		deleteWebsite: deleteWebsite,
		updateWebsite: updateWebsite
	};

	function findWebsiteById(websiteId) {
		return Website.findById(websiteId);
	}

	function createWebsite(userId, website) {
		website._user = userId;
		return Website.create(website);
	}

	function findAllWebsitesForUser(userId) {
		return Website.find({"developerId": userId});
	}

	function updateWebsite(id, newWebsite){
		delete newWebsite._id;
		return Website
			.update({_id: id}, {
				$set: {
					name: newWebsite.name,
					description: newWebsite.description
				}
			});
	}

	function deleteWebsite(id){
		return Website.remove({_id: id});
	}
};
