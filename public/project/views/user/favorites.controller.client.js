(function(){
	angular
		.module("iTube")
		.controller("FavoritesController", FavoritesController);

	function FavoritesController($location, $routeParams, $rootScope, ProjectUserService){
		var vm = this;

		vm.favorites = [];

		if($routeParams.uid){
			vm.userId = $routeParams.uid;
		}
		else{
			vm.userId = $rootScope.currentUser._id;
		}

		function fetch(){
			ProjectUserService
				.getFavoritesForUser(vm.userId)
				.then(
					function(response){
						compileResults(response);
					},
					function(err){
						vm.favorites = [];
					}
				);
		}

		function init(){
			if($routeParams.uid){
				vm.userId = $routeParams.uid;
				(function(){
					ProjectUserService
						.findUserById($routeParams.uid)
						.then(
							function(user){
								vm.user = user.data;
							},
							function(err){
								vm.user = $rootScope.currentUser;
							}
						);
				})();
			}
			else{
				vm.userId = $rootScope.currentUser._id;
				vm.user = $rootScope.currentUser;
			}

			fetch();
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
					author: data.author,
					totalFavs: data.favBy.length
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