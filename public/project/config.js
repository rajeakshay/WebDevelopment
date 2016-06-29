(function(){
	angular
		.module("iTube")
		.config(Config);

	function Config($routeProvider){
		$routeProvider
			.when("/",{
				templateUrl: "views/home/home.view.client.html",
				controller: "HomeController",
				controllerAs: "model"
			})
			.when("/signin",{
				templateUrl: "views/signin/signin.view.client.html",
				controller: "SignInController",
				controllerAs: "model"
			})
			.when("/signup",{
				templateUrl: "views/signup/signup.view.client.html",
				controller: "SignUpController",
				controllerAs: "model"
			})
			.when("/account",{
				templateUrl: "views/user/account.view.client.html",
				controller : "AccountController",
				controllerAs : "model",
				resolve: { loggedIn: checkLoggedIn }
			})
			.when("/account/:uid",{
				templateUrl: "views/user/account.view.client.html",
				controller : "AccountController",
				controllerAs : "model",
				resolve: { loggedIn: checkAdmin }
			})
			.when("/profile",{
				templateUrl: "views/user/profile.view.client.html",
				controller : "ProfileController",
				controllerAs : "model",
				resolve: { loggedIn: checkLoggedIn }
			})
			.when("/profile/:uid",{
				templateUrl: "views/user/profile.view.client.html",
				controller : "ProfileController",
				controllerAs : "model",
				resolve: { loggedIn: checkAdmin }
			})
			.when("/discover", {
				templateUrl: "views/user/discover.view.client.html",
				controller: "DiscoverController",
				controllerAs: "model",
				resolve: { loggedIn: checkLoggedIn }
			})
			.when("/discover/:uid", {
				templateUrl: "views/user/discover.view.client.html",
				controller: "DiscoverController",
				controllerAs: "model",
				resolve: { loggedIn: checkAdmin }
			})
			.when("/favorites", {
				templateUrl: "views/user/favorites.view.client.html",
				controller: "FavoritesController",
				controllerAs: "model",
				resolve: { loggedIn: checkLoggedIn }
			})
			.when("/favorites/:uid", {
				templateUrl: "views/user/favorites.view.client.html",
				controller: "FavoritesController",
				controllerAs: "model",
				resolve: { loggedIn: checkAdmin }
			})
			.when("/network", {
				templateUrl: "views/user/network.view.client.html",
				controller: "NetworkController",
				controllerAs: "model",
				resolve: { loggedIn: checkLoggedIn }
			})
			.when("/network/view/:searchView", {
				templateUrl: "views/user/network.view.client.html",
				controller: "NetworkController",
				controllerAs: "model",
				resolve: { loggedIn: checkLoggedIn }
			})
			.when("/network/:uid", {
				templateUrl: "views/user/network.view.client.html",
				controller: "NetworkController",
				controllerAs: "model",
				resolve: { loggedIn: checkAdmin }
			})
			.when("/network/:uid/view/:searchView", {
				templateUrl: "views/user/network.view.client.html",
				controller: "NetworkController",
				controllerAs: "model",
				resolve: { loggedIn: checkAdmin }
			})
			.when("/network/:uid/view/:searchView", {
				templateUrl: "views/user/network.view.client.html",
				controller: "NetworkController",
				controllerAs: "model",
				resolve: { loggedIn: checkAdmin }
			})
			.when("/admin",{
				templateUrl: "views/admin/admin.view.client.html",
				controller: "AdminController",
				controllerAs : "model",
				resolve: { loggedIn: checkAdmin }
			})
			.otherwise({
				redirectTo: "/signin"
			});

		function checkLoggedIn(ProjectUserService, $location, $q, $rootScope) {
			var deferred = $q.defer();

			ProjectUserService
				.loggedIn()
				.then(
					function (response) {
						var user = response.data;
						if (user){
							console.log(user);
							$rootScope.currentUser = user;
							deferred.resolve();
						} else {
							console.log(user);
							$rootScope.currentUser = null;
							deferred.reject();
							$location.url("/signin");
						}
					},
					function (err) {
						$location.url("/signin");
					}
				);
			return deferred.promise;
		}

		function checkAdmin(ProjectUserService, $location, $q, $rootScope) {
			var deferred = $q.defer();

			ProjectUserService
				.loggedIn()
				.then(
					function (response) {
						var user = response.data;
						if (user && user.role=="admin"){
							console.log(user);
							$rootScope.currentUser = user;
							deferred.resolve();
						} else {
							console.log(user);
							$rootScope.currentUser = null;
							deferred.reject();
							$location.url("/signin");
						}
					},
					function (err) {
						$location.url("/signin");
					}
				);
			return deferred.promise;
		}
	}
})();
