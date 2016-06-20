(function () {
	angular
		.module("WebAppMaker")
		.controller("LoginController", LoginController);

	function LoginController($location, UserService, $rootScope) {
		var vm = this;
		vm.login = function (username, password) {
			UserService
				.login(username, password)
				.then(
					function(response){
						var currentUser = response.data;
						// Login only if a user is found
						if (currentUser && currentUser._id) {
							$rootScope.currentUser = currentUser;
							// Redirect to the user's profile
							$location.url("/user/" + currentUser._id);
						} else {
							vm.loginError = "Could not login";
						}
					},
					function(error){
						vm.loginError = "User not found";
					}
				);
		};

		vm.register = function (){
			// Redirect to Register page
			$location.url("/register");
		}
	}
})();
