;(function () {
    angular
        .module('factory.url', [])
        .factory('url', url);


    url.$inject = [];

    function url() {
        let baseUrl = 'http://api.knightshayes.grassbusinesslabs.tk/';
        return {
            user: {
                login: baseUrl + 'api/auth/login',
                loadUser: baseUrl + 'api/user',
                getItems: baseUrl + 'api/survey',
                register: baseUrl + 'api/auth/register',
                forgot: baseUrl + 'api/user/request-reset',
                reset:  baseUrl + 'api/user/reset-password?token='
            },
            survey_management: {
                createSurvey: baseUrl + 'api/survey',
            },
            survey_management_func(id) {
                return {
                    loadOnlySurvey: baseUrl + 'api/onlysurvey',
                    updateSurvey: baseUrl + 'api/survey/' + id,
                    deleteSurvey: baseUrl + 'api/survey/' + id,
                    changeStatusSurvey: baseUrl + 'api/survey/' + id + '/change-status',
                    archiveStatusSurvey: baseUrl + 'api/survey/' + id + '/archive-status',
                    block : baseUrl + 'api/survey/' + id + '/add-block',
                    createBlock : baseUrl + 'api/survey/' + id + '/add-block',
                    updateBlock : baseUrl + 'api/block/' + id,
                    createQuestion : baseUrl + 'api/block/' + id + '/add-question',
                    updateQuestion : baseUrl + 'api/question/' + id,
                    createAnswer: baseUrl + 'api/question/' + id + '/add-answer',
                    updateAnswer: baseUrl + 'api/answer/' + id,
                };
            },
            customers: {
                customers: baseUrl + 'api/customer'
            },
            customers_func(id) {
                return {
                    updateCustomers: baseUrl + 'api/customer/'+ id,
                    sendCustomerAnswer: baseUrl + 'api/customer/' + id.customer + '/question/'+ id.question + '/make-answer',

                    getCustomerAnswer: baseUrl + 'api/customer/' + id.customer + '/survey/' + id.survey + '/list'
                }
            },
            report: {
                createReport: baseUrl + 'api/report'
            },
            report_func(id) {
                return {
                    // update: baseUrl + 'dfsdf'
                }
            },

            contract_research_func(id) {
                return {
                    createResearch: baseUrl + 'api/new-contract-research',
                    deleteResearch: baseUrl + 'api/contract-research/' + id
                };
            },

            contract_editor_func(id) {
                return {
                    createSurveyTemplate: baseUrl + '/api/contract-research/' + id + '/contract',
                    // createSurveyTemplate: baseUrl + 'api/contract',
                    getTemplates: baseUrl + 'api/contract',
                    deleteTemplate: baseUrl + 'api/contract/' + id,
                    updateTemplate: baseUrl + 'api/contract/' + id,
                    createVariability: baseUrl + 'api/variable',
                    getVariability: baseUrl + 'api/variable',
                    editVariability: baseUrl + 'api/variable/' + id,
                    deleteVariability: baseUrl + 'api/variable/' + id
                };
            },

            contract_download_func (idReport, idContract) {
                return {
                    downloadPDF: baseUrl + 'api/report/'+ idReport + '/contract/' + idContract + '/download'
                };
            }

        };
    }

})();