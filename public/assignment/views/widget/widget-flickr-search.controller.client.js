(function(){
	angular
		.module("WebAppMaker")
		.controller("FlickrImageSearchController", FlickrImageSearchController);

	function FlickrImageSearchController($location, $routeParams, WidgetService, FlickrService) {
		var vm = this;
		vm.userId = $routeParams.uid;
		vm.websiteId = $routeParams.wid;
		vm.pageId = $routeParams.pid;
		vm.widgetId = $routeParams.wgid;

		vm.searchPhotos = searchPhotos;
		vm.selectPhoto = selectPhoto;

		function init(){
			FlickrService
				.retrieveKey()
				.then(function(response){
					vm.flickrKey = response.data;
				});
		}
		init();

		function searchPhotos(keywords) {
			FlickrService
				.searchPhotos(vm.flickrKey, keywords)
				.then(function(response){
					data = response.data.replace("jsonFlickrApi(","");
					data = data.substring(0,data.length - 1);
					data = JSON.parse(data);
					vm.photos = data.photos;
				});
		}

		function selectPhoto(photo){
			var url = "https://farm" + photo.farm +
				".staticflickr.com/" + photo.server +
				"/" + photo.id + "_" + photo.secret + "_b.jpg";

			widget = {
				_id : vm.widgetId,
				widgetType : "IMAGE",
				pageId : vm.pageId,
				width : "100%",
				url : url
			};

			WidgetService
				.updateWidget(vm.widgetId, widget)
				.then(function (response) {
					$location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget/" + vm.widgetId);
				}, function(err){
					vm.error = error.data;
				});
		}
	}
})();
