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
            survey_management: {
                createSurvey: baseUrl + 'api/survey',
            },
            survey_management_func(id) {
                return {
                    survey: baseUrl + 'api/survey',
                    block : baseUrl + 'api/survey/' + id + '/add-block',
                    createQuestion : baseUrl + 'api/block/' + id + '/add-question',
                    updateQuestion : baseUrl + 'api/question/' + id,
                }
            },
            customers: {
                customers: baseUrl + 'api/customer'
            },
            customers_func(id) {
                return {
                    updateCustomers : baseUrl + 'api/customer/'+ id
                }
            }
        };
    }

})();