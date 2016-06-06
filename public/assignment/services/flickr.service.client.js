(function(){
	angular
		.module("WebAppMaker")
		.factory("FlickrService", FlickrService);

	var urlBase = "https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&api_key=API_KEY&text=TEXT";

	function FlickrService($http) {
		return {
			searchPhotos: searchPhotos,
			retrieveKey: getKey
		};

		function getKey(){
			return $http.get("/api/flickr");
		}

		function searchPhotos(flickrKey, keywords) {
			var url = urlBase
				.replace("API_KEY", flickrKey)
				.replace("TEXT", keywords);
			return $http.get(url);
		}
	}
})();
