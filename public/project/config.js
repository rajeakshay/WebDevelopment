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
				controllerAs : "model"
			})
			.when("/profile",{
				templateUrl: "views/user/profile.view.client.html",
				controller : "ProfileController",
				controllerAs : "model"
			})
			.when("/feed", {
				templateUrl: "views/user/feed.view.client.html",
				controller: "FeedController",
				controllerAs: "model"
			})
			.when("/friends", {
				templateUrl: "views/user/friends.view.client.html",
				controller: "FriendsController",
				controllerAs: "model"
			})
			.when("/favorites", {
				templateUrl: "views/user/favorites.view.client.html",
				controller: "FavoritesController",
				controllerAs: "model"
			})
			.when("/admin",{
				templateUrl: "views/admin/admin.view.client.html",
				controller: "AdminController",
				controllerAs : "model"
			})
			.when("/admin/:uId/account",{
				templateUrl: "views/user/account.view.client.html",
				controller : "AccountController",
				controllerAs : "model"
			})
			.when("/admin/:uId/profile",{
				templateUrl: "views/user/profile.view.client.html",
				controller : "ProfileController",
				controllerAs : "model"
			})
			.when("/admin/:uId/favorites",{
				templateUrl: "views/user/favorites.view.client.html",
				controller: "FavoritesController",
				controllerAs: "model"
			})
			.when("/admin/:uId/friends",{
				templateUrl: "views/user/friends.view.client.html",
				controller: "FriendsController",
				controllerAs: "model"
			})
			.when("/video",{
				templateUrl: "views/video/video-list.view.client.html",
				controller: "VideoListController",
				controllerAs: "model"
			})
			.when("/video/:vId",{
				templateUrl: "views/video/video.view.client.html",
				controller: "VideoController",
				controllerAs: "model"
			})
			.otherwise({
				redirectTo: "/"
			});
	}
})();
