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

		// right padding s with c to a total of n chars
		function padding_right(s, c, n) {
			if (! s || ! c || s.length >= n) {
				return s;
			}
			var max = (n - s.length)/c.length;
			for (var i = 0; i < max; i++) {
				s += c;
			}
			return s;
		}

		function compileResults(data){
			vm.videoResults.length = 0;
			for (var i = data.items.length - 1; i >= 0; i--) {
				vm.videoResults.push({
					id: data.items[i].id.videoId,
					url: $sce.trustAsResourceUrl("https://www.youtube.com/embed/" + data.items[i].id.videoId),
					title: padding_right(data.items[i].snippet.title.replace(/(\r\n|\n|\r)/gm,""), " ", 25),
					description: padding_right(data.items[i].snippet.description.replace(/(\r\n|\n|\r)/gm,""), " ", 60),
					thumbnail: data.items[i].snippet.thumbnails.default.url,
					author: padding_right(data.items[i].snippet.channelTitle, " ", 50),
					original: {
						videoId: data.items[i].id.videoId,
						title: data.items[i].snippet.title,
						author: data.items[i].snippet.channelTitle,
						description: data.items[i].snippet.description
					},
					added: false,
					error: false
				});
			}
			return vm.videoResults;
		}

		vm.addFavorite = function(hit){
			VideoService
				.getVideoByVideoId(hit.original.videoId)
					.then(
						function(success){
							ProjectUserService
								.addToFavorite(vm.user._id, hit.original)
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
						},
						function(err){
							VideoService
								.createVideo(hit.original)
								.then(
									function(newVideo){
										ProjectUserService
											.addToFavorite(vm.user._id, newVideo.data)
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
									},
									function(err){
										hit.added = false;
										hit.error = true;
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
