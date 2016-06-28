(function(){
	angular
		.module("iTube")
		.controller("ProfileController", ProfileController);

	function ProfileController($location, $rootScope, $routeParams, ProjectUserService, VideoService){
		var vm = this;
		vm.public = [];
		vm.network = [];

		function fetch(){
			VideoService
				.getPublicFeed()
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
					_id: data[i]._id,
					videoId: data[i].videoId,
					url: $sce.trustAsResourceUrl("https://www.youtube.com/embed/" + data[i].videoId),
					title: data[i].title.substring(0,25) + "...",
					description: data[i].description.substring(0,60) + "...",
					author: data[i].author,
					favs: data[i].favBy.length
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
