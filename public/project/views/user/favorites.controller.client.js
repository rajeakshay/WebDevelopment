(function(){
	angular
		.module("iTube")
		.controller("FavoritesController", FavoritesController);

	function FavoritesController($sce, $location, $routeParams, $rootScope, ProjectUserService){
		var vm = this;

		vm.favorites = [];

		function init(){
			if($routeParams.uid){
				vm.userId = $routeParams.uid;
				(function(){
					ProjectUserService
						.findUserById($routeParams.uid)
						.then(
							function(user){
								vm.user = user.data;
								return vm.user;
							},
							function(err){
								vm.user = $rootScope.currentUser;
								return vm.user;
							}
						).then(
						function(user){
							fetch();
						}
					);
				})();
			}
			else{
				vm.userId = $rootScope.currentUser._id;
				vm.user = $rootScope.currentUser;
				fetch();
			}
		}

		function fetch(){
			ProjectUserService
				.getFavoritesForUser(vm.userId)
				.then(
					function(response){
						console.log(response);
						compileResults(response.data);
					},
					function(err){
						vm.favorites = [];
					}
				);
		}
		init();

		function compileResults(data){
			vm.favorites.length = 0;
			for (var i = data.length - 1; i >= 0; i--) {
				vm.favorites.push({
					_id: data[i]._id,
					videoId: data[i].videoId,
					url: $sce.trustAsResourceUrl("https://www.youtube.com/embed/" + data[i].videoId),
					title: data[i].title.substring(0,25) + "...",
					description: data[i].description.substring(0,60) + "...",
					author: data[i].author,
					totalFavs: data[i].favBy.length
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