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
			return vm.network;
		}

		vm.addFavorite = function(hit, viewId){
			ProjectUserService
				.addToFavorite(vm.user._id, hit.video)
				.then(
					function(success){
						hit.added = true;
						hit.error = false;
						hit.video.favs = hit.video.favs + 1;
						vm.user.favorites.push(hit.video._id);
						if(viewId == 0){
							for(var i = 0; i < vm.network.length; i++){
								if(vm.network[i].video._id == hit.video._id){
									vm.network[i].added = true;
									vm.network[i].video.favs = vm.network[i].video.favs + 1;
									break;
								}
							}
						}
						else{
							for(var j = 0; j < vm.public.length; j++){
								if(vm.public[j].video._id == hit.video._id){
									vm.public[j].added = true;
									vm.public[j].video.favs = vm.public[j].video.favs + 1;
									break;
								}
							}
						}
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
