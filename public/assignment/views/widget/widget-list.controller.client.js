(function () {
	angular
		.module("WebAppMaker")
		.controller("ListWidgetController", ListWidgetController);

	function ListWidgetController($sce, $routeParams, WidgetService){
		var vm = this;
		vm.userId = $routeParams.uid;
		vm.pageId = $routeParams.pid;
		vm.websiteId = $routeParams.wid;

		function init() {
			WidgetService
				.findWidgetsByPageId(vm.pageId)
				.then(function(response){
					vm.widgets = angular.copy(response.data);
					$("#isSortable").sortable({axis : "y"});
				});
		}
		init();

		vm.getSafeHtml = function getSafeHtml(widget) {
			return $sce.trustAsHtml(widget.text);
		};

		vm.getSafeUrl = function getSafeUrl(widget) {
			var urlParts = widget.url.split("/");
			var id = urlParts[urlParts.length - 1];
			var url = "https://www.youtube.com/embed/" + id;
			return $sce.trustAsResourceUrl(url);
		}
	}
})();

