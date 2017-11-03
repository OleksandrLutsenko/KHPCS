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
            survey_management(id) {
                return {
                    survey: baseUrl + 'api/survey',
                    block : baseUrl + 'api/survey/' + id + '/add-block',
                    question : baseUrl + 'api/block/' + id + '/add-question',

                    loadSurvey: baseUrl + 'api/survey/' + id
                }
            },
            customers: {
                indexCustomers: baseUrl + 'api/customer'
            },
            customers_func(id) {
                return {
                    updateCustomers : baseUrl + 'api/customer/'+ id
                }
            }
        };
    }

})();