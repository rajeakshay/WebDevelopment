(function () {
	angular
		.module("WebAppMaker")
		.controller("LoginController", LoginController);

	function LoginController($location, UserService) {
		var vm = this;
		vm.login = function (username, password) {
			var currentUser = UserService.findUserByCredentials(username, password);
			// Login only if a user is found
			if (currentUser) {
				// Redirect to the user's profile
				$location.url("/user/" + currentUser._id);
			} else {
				vm.loginError = "Username/Password combination not found";
			}
		};

		vm.register = function (){
			// Redirect to Register page
			$location.url("/register");
		}
	}
})();
