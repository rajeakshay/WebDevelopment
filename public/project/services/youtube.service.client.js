(function(){
	angular
		.module("iTube")
		.factory("YoutubeService", YoutubeService);

	function YoutubeService($http){
		return {
			search: search,
			getYoutubeKey: getYoutubeKey
		};
		
		function getYoutubeKey(){
			return $http.get("/api/youtube");
		}

		function search(keywords, apiKey){
			return $http.get('https://www.googleapis.com/youtube/v3/search', {
				params: {
					key: apiKey,
					type: 'video',
					maxResults: '40',
					part: 'id,snippet',
					fields: 'items/id,items/snippet/title,items/snippet/description,items/snippet/thumbnails/default,items/snippet/channelTitle',
					q: (keywords) ? keywords : ''
				}
			});
		}
	}
})();