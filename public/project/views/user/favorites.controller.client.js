(function(){
	angular
		.module("iTube")
		.controller("FavoritesController", FavoritesController);

	function FavoritesController($location, $rootScope, ProjectUserService){
		var vm = this;
		
		function init(){
			// ProjectUserService
			// 	.getFavoritesForUser(userId)
			// 	.then(
			// 		function(response){
			// 			compileResults(response);
			// 		},
			// 		function(err){
			// 			vm.favorites = [];
			// 		}
			// 	);
		}
		init();

		function compileResults(data){
			vm.favorites.length = 0;
			for (var i = data.length - 1; i >= 0; i--) {
				vm.favorites.push({
					_id: data._id,
					videoId: data.videoId,
					url: $sce.trustAsResourceUrl("https://www.youtube.com/embed/" + data.videoId),
					title: data.title.substring(0,25) + "...",
					description: data.description.substring(0,60) + "...",
					author: data.author
				});
			}
			return vm.favorites;
		}

		vm.logout = function(){
			ProjectUserService
				.signout()
				.then(
					function(response){
						$rootScope.currentUser = null;
						$location.url("/");
					}
				);
		}
	}
})();