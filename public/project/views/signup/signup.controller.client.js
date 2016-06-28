(function(){
	angular
		.module("iTube")
		.controller("SignUpController", SignUpController);

	function SignUpController($location, ProjectUserService, $rootScope){
		var vm = this;
		vm.createUser = function (email, password, confirmPassword, firstName, lastName){
			var user = {
				email : email,
				password : password,
				firstName: firstName,
				lastName: lastName
			};

			if (!user.email || !user.password || !confirmPassword || !user.firstName || !user.lastName) {
				vm.signUpError = "All fields are required.";
			}
			// Password and Verify Password fields should exactly match
			else if (user.password != confirmPassword) {
				vm.signUpError = "Password and Confirm Password fields should match.";
			}
			else {
				ProjectUserService
					.signup(user)
					.then(
						function(response){
							var newUser = response.data;
							if(newUser && newUser._id) {
								$rootScope.currentUser = newUser;
								$location.url("/account/"+ newUser._id);
							}
						},
						function(err){
							vm.signUpError = "Error! User already exists.";
						}
					);
			}
		}
	}
})();