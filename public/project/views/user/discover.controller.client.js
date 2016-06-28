(function(){
	angular
		.module("iTube")
		.controller("DiscoverController", DiscoverController);

	function DiscoverController($sce, $location, $rootScope, YoutubeService, ProjectUserService, VideoService){
		var vm = this;
		vm.videoResults = [];
		vm.user = $rootScope.currentUser;
		
		function init(){
			YoutubeService
				.getYoutubeKey()
				.then(function(response){
					vm.youtubeKey = response.data;
				}); 
		}
		init();
		vm.search = function(keywords){
			YoutubeService
				.search(keywords, vm.youtubeKey)
				.then(
					function(response){
						compileResults(response.data);
					},
					function(err){
						vm.videoResults = [];
					}
				);
		};

		function compileResults(data){
			vm.videoResults.length = 0;
			for (var i = data.items.length - 1; i >= 0; i--) {
				vm.videoResults.push({
					id: data.items[i].id.videoId,
					url: $sce.trustAsResourceUrl("https://www.youtube.com/embed/" + data.items[i].id.videoId),
					title: data.items[i].snippet.title.substring(0,25) + "...",
					description: data.items[i].snippet.description.substring(0,60) + "...",
					thumbnail: data.items[i].snippet.thumbnails.default.url,
					author: data.items[i].snippet.channelTitle
				});
			}
			return vm.videoResults;
		}

		vm.addFavorite = function(video){
				VideoService
					.getVideoByVideoId(video.id)
					.then(
						function(newVideo){
							ProjectUserService
								.addToFavorite(vm.user._id, newVideo)
								.then(
									function(success){
										vm.updateSuccess = "Added to Favorites";
									},
									function(err){
										vm.updateError = "Could not add to Favorites";
									}
								);
						},
						function(err){
							VideoService
								.createVideo(video)
								.then(
									function(newVideo){
										ProjectUserService
											.addToFavorite(vm.user._id, newVideo)
											.then(
												function(success){
													vm.updateSuccess = "Added to Favorites";
												},
												function(err){
													vm.updateError = "Could not add to Favorites";
												}
											);
									},
									function(err){
										vm.updateError = "Could not add to Favorites";
									}
								);
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
