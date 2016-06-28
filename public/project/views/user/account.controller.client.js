(function(){
	angular
		.module("iTube")
		.controller("AccountController", AccountController);

	function AccountController($routeParams, $location, $rootScope, ProjectUserService){
		var vm = this;
		if($routeParams.uid){
			vm.userId = $routeParams.uid;
		}
		else{
			vm.userId = $rootScope.currentUser._id;
		}
		
		function init(){
			ProjectUserService
				.findUserById(vm.userId)
				.then(function(response){
					var currentUser = response.data;
					if(currentUser && currentUser._id){
						vm.user = angular.copy(response.data);
					}
				});
		}
		init();

		vm.updateUser = function (newUser) {
			ProjectUserService
				.updateUser(vm.userId, newUser)
				.then(
					function(){
						vm.updateSuccess = "Account details saved.";
					},
					function(){
						vm.updateError = "Failed to update user.";
					}
				);
		};

		vm.makeAdmin = function (newUser) {
			newUser.role = "admin";
			ProjectUserService
				.updateUser(vm.userId, newUser)
				.then(
					function(){
						vm.updateSuccess = "User is now admin.";
					},
					function(){
						vm.updateError = "Failed to make the user an admin.";
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