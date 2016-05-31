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
			var id = UserService.createUser(user);
			if(id != -1){
				$location.url("/user/"+id);
			}
			else{
				vm.error = "Error! Check the given username and passwords again.";
			}
		};

		vm.cancel = function(){
			$location.url("/login");
		};
	}

})();
