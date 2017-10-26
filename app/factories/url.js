;(function () {
    angular
        .module('factory.url', [])
        .factory('url', url);


    url.$inject = [];

    function url() {
        let baseUrl = 'http://api.knightshayes.grassbusinesslabs.tk/api/';
        return {
            user: {
                login: baseUrl + 'login',
                getItems: baseUrl + 'user/get-available-items',
            },
            // weather: baseUrl + 'weather'
        };
    }

})();