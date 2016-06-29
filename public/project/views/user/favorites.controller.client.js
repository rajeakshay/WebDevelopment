(function(){
	angular
		.module("iTube")
		.controller("FavoritesController", FavoritesController);

	function FavoritesController($sce, $location, $routeParams, $rootScope, ProjectUserService){
		var vm = this;

		vm.seeButton = false;
		vm.favorites = [];

		function init(){
			if($routeParams.uid){
				vm.userId = $routeParams.uid;
				if($routeParams.otherid){
					vm.otherUserId = $routeParams.otherid;
				}
				else{
					vm.otherUserId = $rootScope.currentUser._id;
				}
				(function(){
					ProjectUserService
						.findUserById($routeParams.uid)
						.then(
							function(user){
								vm.user = user.data;
								vm.seeButton = true;
								fetchForOtherUser();
							},
							function(err){
								vm.user = $rootScope.currentUser;
								vm.seeButton = false;
								fetchForMe();
							}
						);
				})();
			}
			else{
				vm.userId = $rootScope.currentUser._id;
				vm.otherUserId = $rootScope.currentUser._id;
				vm.user = $rootScope.currentUser;
				vm.seeButton = false;
				fetchForMe();
			}
		}

		function fetchForMe(){
			ProjectUserService
				.getFavoritesForUser(vm.userId)
				.then(
					function(response){
						compileResults(response.data);
					},
					function(error){
						vm.favorites = [];
					}
				);
		}

		function fetchForOtherUser(){
			ProjectUserService
				.getFavoritesForUser(vm.userId)
				.then(
					function(otherFavorites){
						ProjectUserService
							.getFavoritesForUser(vm.otherUserId)
							.then(
								function(myFavorites){
									var his = compilePseudoResults(otherFavorites.data);
									var mine = compilePseudoResults(myFavorites.data);
									if(his.length != 0 && mine.length != 0){
										for(var i = 0; i < his.length; i++){
											for(var j = 0; j < mine.length; j++){
												if(his[i].video._id == mine[j].video._id){
													his[i].added = true;
													break;
												}
											}
										}
									}
									vm.favorites = his;
								},
								function(err){
									compileResults(otherFavorites.data);
								}
							);
					},
					function(err){
						vm.favorites = [];
					}
				);
		}

		// IMPORTANT: Initialize
		init();

		function compilePseudoResults(data){
			var f = [];
			for (var i = data.length - 1; i >= 0; i--) {
				f.push({
					added: false,
					error: false,
					video: {
						_id: data[i]._id,
						videoId: data[i].videoId,
						url: $sce.trustAsResourceUrl("https://www.youtube.com/embed/" + data[i].videoId),
						title: data[i].title.substring(0,25) + "...",
						description: data[i].description.substring(0,60) + "...",
						author: data[i].author,
						totalFavs: data[i].favBy.length
					}
				});
			}
			return f;
		}

		function compileResults(data){
			vm.favorites.length = 0;
			for (var i = data.length - 1; i >= 0; i--) {
				vm.favorites.push({
					added: false,
					error: false,
					video: {
						_id: data[i]._id,
						videoId: data[i].videoId,
						url: $sce.trustAsResourceUrl("https://www.youtube.com/embed/" + data[i].videoId),
						title: data[i].title.substring(0,25) + "...",
						description: data[i].description.substring(0,60) + "...",
						author: data[i].author,
						totalFavs: data[i].favBy.length
					}
				});
			}
			return vm.favorites;
		}

		vm.addFavorite = function(hit){
			ProjectUserService
				.addToFavorite(vm.otherUserId, hit.video)
				.then(
					function(success){
						hit.added = true;
						hit.error = false;
						hit.video.totalFavs = hit.video.totalFavs + 1;
					},
					function(err){
						hit.added = false;
						hit.error = true;
					}
				);
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