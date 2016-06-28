(function(){
	angular
		.module("iTube")
		.controller("AdminController", AdminController);

	function AdminController($location, $rootScope, ProjectUserService){
		var vm = this;
		vm.userResults = [];

		function init(){
			ProjectUserService
				.getAllUsers()
				.then(
					function(response){
						console.log(response.data);
						compileResults(response.data);
					},
					function(err){
						vm.userResults = [];
					}
				);
		}
		init();

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

		vm.deleteUser = function(userId){
			ProjectUserService
				.deleteUser(userId)
				.then(
					function(succ){
						$location.url("/admin");
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