;(function () {
    angular
        .module('factory.url', [])
        .factory('url', url);


    url.$inject = [];

    function url() {
        let baseUrl = 'http://api.knightshayes.grassbusinesslabs.tk/';
        return {
            user: {
                login: baseUrl + 'api/login',
                getItems: baseUrl + 'user/get-available-items',
                register: baseUrl + 'public/api/register'
            },
            // weather: baseUrl + 'weather'
        };
    }

})();