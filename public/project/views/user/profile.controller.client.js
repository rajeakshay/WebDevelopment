(function(){
	angular
		.module("iTube")
		.controller("ProfileController", ProfileController);

	function ProfileController($sce, $location, $rootScope, $routeParams, ProjectUserService){
		var vm = this;
		vm.public = [];
		vm.network = [];
		vm.networkRecommendations = 0;

		function fetch(){
			ProjectUserService
				.getFilteredFeed(vm.userId)
				.then(
					function(response){
						compilePublicFeed(response.data);
					},
					function(err){
						vm.public = [];
					}
				);

			ProjectUserService
				.getUserFeed(vm.userId)
				.then(
					function(response){
						compileNetworkFeed(response.data);
					},
					function(err){
						vm.network = [];
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

		function compilePublicFeed(data){
			vm.public.length = 0;
			for (var i = data.length - 1; i >= 0; i--) {
				vm.public.push({
					added: false,
					error: false,
					video: {
						_id: data[i]._id,
						videoId: data[i].videoId,
						url: $sce.trustAsResourceUrl("https://www.youtube.com/embed/" + data[i].videoId),
						title: data[i].title.substring(0,25) + "...",
						description: data[i].description.substring(0,60) + "...",
						author: data[i].author,
						favs: data[i].favBy.length
					}
				});
			}
			return vm.public;
		}

		function compileNetworkFeed(data){
			vm.network.length = 0;
			for (var i = data.length - 1; i >= 0; i--) {
				vm.network.push({
					_id: data[i]._id,
					videoId: data[i].videoId,
					url: $sce.trustAsResourceUrl("https://www.youtube.com/embed/" + data[i].videoId),
					title: data[i].title.substring(0,25) + "...",
					description: data[i].description.substring(0,60) + "...",
					author: data[i].author,
					favs: data[i].favBy.length
				});
			}
			return vm.network;
		}

		vm.addFavorite = function(hit){
			ProjectUserService
				.addToFavorite(vm.user._id, hit.    video)
				.then(
					function(success){
						hit.added = true;
						hit.error = false;
					},
					function(err){
						hit.added = false;
						hit.error = true;
					}
				);
		};

		vm.toggleView = function(){
			if(vm.networkRecommendations === 0){
				vm.networkRecommendations = 1;
			}
			else{
				vm.networkRecommendations = 0;
			}
		};

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
