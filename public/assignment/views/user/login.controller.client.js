(function () {
	angular
		.module("WebAppMaker")
		.controller("LoginController", LoginController);

	function LoginController($location, UserService) {
		var vm = this;
		vm.login = function (username, password) {
			// Username and password required to login
			if(!username || !password) {
				vm.loginError = "Username/Password left blank";
			}
			else {
				UserService
					.findUserByCredentials(username, password)
					.then(function(response){
						var currentUser = response.data;
						// Login only if a user is found
						if (currentUser._id) {
							// Redirect to the user's profile
							$location.url("/user/" + currentUser._id);
						} else {
							vm.loginError = "Username/Password combination not found";
						}
					});
			}
		};

		vm.register = function (){
			// Redirect to Register page
			$location.url("/register");
		}
	}
})();
