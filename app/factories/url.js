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
                getItems: baseUrl + 'api/survey',
                register: baseUrl + 'public/api/register'
            },
            survey_management(Snum) {
                return{
                    survey: baseUrl + 'api/survey/',
                    block : baseUrl + 'api/survey/' + Snum + '/add-block'
                }
            }
        };
    }

})();