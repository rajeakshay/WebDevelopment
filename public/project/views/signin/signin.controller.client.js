(function(){
	angular
		.module("iTube")
		.controller("SignInController", SignInController);

	function SignInController($location, ProjectUserService, $rootScope){
		var vm = this;
		vm.signin = function (email, password) {
			if (!email || !password) {
				vm.signInError = "All fields are required.";
			}
			else {
				var user = {
					email: email,
					password: password
				};
				ProjectUserService
						.signin(user)
					.then(
						function(response){
							var currentUser = response.data;
							// Login only if a user is found
							if (currentUser && currentUser._id) {
								$rootScope.currentUser = currentUser;
								// Redirect to the user's profile
								$location.url("/profile");
							} else {
								vm.signInError = "Login failed.";
							}
						},
						function(error){
							vm.signInError = "Email Address/Password combination not found.";
						}
					);
			}
		};
	}
})();