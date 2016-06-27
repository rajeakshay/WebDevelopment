(function(){
	angular
		.module("iTube")
		.controller("SignInController", SignInController);

	function SignInController($location, ProjectUserService, $rootScope){
		var vm = this;
		vm.login = function (email, password) {
			if (!email || !password) {
				vm.signInError = "All fields are required.";
			}
			else {
				ProjectUserService
					.signin(email, password)
					.then(
						function(response){
							var currentUser = response.data;
							// Login only if a user is found
							if (currentUser && currentUser._id) {
								$rootScope.currentUser = currentUser;
								// Redirect to the user's profile
								$location.url("/user/" + currentUser._id);
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