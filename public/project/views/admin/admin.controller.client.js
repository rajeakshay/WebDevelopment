(function(){
	angular
		.module("iTube")
		.controller("AdminController", AdminController);

	function AdminController($location, $rootScope, ProjectUserService){
		var vm = this;
		vm.userResults = [
			{_id: 1, firstName: "Akshay", lastName: "Raje", noOfFavorites: 5, noOfFollowers: 3, noOfFollowing: 2}
		];
		function init(){
			// ProjectUserService
			// 	.getAllUsers()
			// 	.then(
			// 		function(response){
			// 			compileResults(response.data);
			// 		},
			// 		function(err){
			// 			vm.userResults = [];
			// 		}
			// 	);
		}
		init();

		function compileResults(data){
			vm.userResults.length = 0;
			for (var i = data.length - 1; i >= 0; i--) {
				vm.userResults.push({
					_id: data[i]._id,
					firstName: data[i].firstName,
					lastName: data[i].lastName,
					noOfFollowers: data[i].followers.length,
					noOfFollowing: data[i].following.length,
					noOfFavorites: data[i].favorites.length
				});
			}
			return vm.userResults;
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