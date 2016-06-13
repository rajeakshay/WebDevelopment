(function () {
	angular
		.module("WebAppMaker")
		.controller("RegisterController", RegisterController);

	function RegisterController($location, UserService) {
		var vm = this;

		vm.createUser = function (username, password, verifyPassword) {
			var user = {
				username : username,
				password : password,
				verifyPassword: verifyPassword
			};
			// Given username, password and verify password fields should not be blank
			if (!user.username || !user.password || !user.verifyPassword) {
				vm.error = "Error! One of the fields is left blank.";
			}
			// Password and Verify Password fields should exactly match
			else if (user.password != user.verifyPassword) {
				vm.error = "Error! Password and Verify Password do not match.";
			}
			else {
				UserService
					.createUser(user)
					.then(function(response){
						var newUser = response.data;
						if(newUser && newUser._id) {
							$location.url("/user/"+ newUser._id);
						}
					});
			}
		};

		vm.cancel = function(){
			$location.url("/login");
		};
	}

})();
