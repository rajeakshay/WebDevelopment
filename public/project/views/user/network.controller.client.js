(function(){
	angular
		.module("iTube")
		.controller("NetworkController", NetworkController);

	function NetworkController($location, $routeParams, $rootScope, ProjectUserService){
		var vm = this;
		vm.userResults = [];
		vm.following = [];
		vm.followers = [];

		function fetch(){
			ProjectUserService
				.getAllUsers()
				.then(
					function(response){
						compileResults(response.data);
					},
					function(err){
						vm.userResults = [];
					}
				);

			ProjectUserService
				.getFollowersForUser(vm.userId)
				.then(
					function(response){
						compileFollowers(response.data);
					},
					function(err){
						vm.followers = [];
					}
				);

			ProjectUserService
				.getFollowingForUser(vm.userId)
				.then(
					function(response){
						compileFollowing(response.data);
					},
					function(err){
						vm.following = [];
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

		function compileFollowers(data){
			vm.followers.length = 0;
			for (var i = data.length - 1; i >= 0; i--) {
				vm.followers.push({
					_id: data[i]._id,
					name: data[i].firstName.concat(" ").concat(data[i].lastName),
					noOfFollowers: data[i].followers.length,
					noOfFollowing: data[i].following.length,
					noOfFavorites: data[i].favorites.length
				});
			}
			return vm.followers;
		}

		function compileFollowing(data){
			vm.following.length = 0;
			for (var i = data.length - 1; i >= 0; i--) {
				vm.following.push({
					_id: data[i]._id,
					name: data[i].firstName.concat(" ").concat(data[i].lastName),
					noOfFollowers: data[i].followers.length,
					noOfFollowing: data[i].following.length,
					noOfFavorites: data[i].favorites.length
				});
			}
			return vm.following;
		}

		function compileResults(data){
			vm.userResults.length = 0;
			for (var i = data.length - 1; i >= 0; i--) {
				vm.userResults.push({
					_id: data[i]._id,
					name: data[i].firstName.concat(" ").concat(data[i].lastName),
					noOfFollowers: data[i].followers.length,
					noOfFollowing: data[i].following.length,
					noOfFavorites: data[i].favorites.length
				});
			}
			return vm.userResults;
		}

		vm.follow = function(following){
			ProjectUserService
				.addToFollowing(vm.userId, following)
				.then(
					function(success){
						$location.url("/network");
					},
					function(err){
						vm.updateError = "Could not follow the user.";
					}
				);
		};

		vm.unfollow = function(followingId){
			ProjectUserService
				.removeFromFollowing(vm.userId, followingId)
				.then(
					function(success){
						$location.url("/network");
					},
					function(err){
						vm.updateError = "Could not unfollow the user.";
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