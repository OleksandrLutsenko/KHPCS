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
                loadSurveysOnly: baseUrl + 'api/onlysurvey',
                register: baseUrl + 'api/auth/register',
                forgot: baseUrl + 'api/user/request-reset'
            },
            survey_management: {
                createSurvey: baseUrl + 'api/survey',
            },
            reset_func(token){
                return { resetPass: baseUrl + 'api/user/reset-password?token=' + token }
            },
            user_func(id){
                return { updateProfile: baseUrl + 'api/user/' + id }
            },
            survey_management_func(id) {
                return {
                    loadOnlySurvey: baseUrl + 'api/onlysurvey',
                    loadOneSurvey: baseUrl + 'api/survey/' + id,
                    updateSurvey: baseUrl + 'api/survey/' + id,
                    deleteSurvey: baseUrl + 'api/survey/' + id,
                    deletedQuestionsInSurvey: baseUrl + 'api/survey/' + id + '/deleted-questions',
                    changeStatusSurvey: baseUrl + 'api/survey/' + id + '/change-status',
                    archiveStatusSurvey: baseUrl + 'api/survey/' + id + '/archive-status',
                    block: baseUrl + 'api/survey/' + id + '/add-block',
                    createBlock: baseUrl + 'api/survey/' + id + '/add-block',
                    updateBlock: baseUrl + 'api/block/' + id,
                    //
                    addBlockQuestion: baseUrl + 'api/block/' + id + '/add-block-questions'
                };
            },
            customers: {
                customers: baseUrl + 'api/customer'
            },
            customers_func(id) {
                return {
                    updateCustomers: baseUrl + 'api/customer/' + id,
                    sendCustomerAnswer: baseUrl + 'api/customer/' + id + '/make-answer',

                    getCustomerAnswer: baseUrl + 'api/customer/' + id.customer + '/survey/' + id.survey + '/list'
                };
            },
            report: {
                createReport: baseUrl + 'api/report'
            },

            contract_research_func(id) {
                return {
                    createResearch: baseUrl + 'api/new-contract-research',
                    deleteResearch: baseUrl + 'api/contract-research/' + id
                };
            },

            contract_editor_func(id) {
                return {
                    createSurveyTemplate: baseUrl + 'api/contract-research/' + id + '/contract',
                    getOneTemplate: baseUrl + 'api/contract/' + id,
                    getTemplates: baseUrl + 'api/contract',
                    getTemplatesForThePool: baseUrl + 'api/survey/' + id + '/contracts',
                    getTemplateList: baseUrl + 'api/onlycontract',
                    deleteTemplate: baseUrl + 'api/contract/' + id,
                    updateTemplate: baseUrl + 'api/contract/' + id,
                    createVariability: baseUrl + 'api/variable',
                    getVariability: baseUrl + 'api/variable',
                    getVariabilityWithDeleted: baseUrl + 'api/variable-all',
                    editVariability: baseUrl + 'api/variable/' + id,
                    deleteVariability: baseUrl + 'api/variable/' + id
                };
            },

            contract_image_func (id) {
                return {
                    uploadImage: baseUrl + 'api/contract-research/' + id + '/save-image',
                    imageListInResearch: baseUrl + 'api/contract/' + id + '/image-list',
                    deleteImage: baseUrl + 'api/contract/image/' + id
                };
            },

            contract_download_func (idReport, idContract, filename) {
                return {
                    downloadPDF: baseUrl + 'api/report/'+ idReport + '/contract/' + idContract + '/review/' + filename,
                    removePDF: baseUrl + '/api/storage/contracts/' + idReport
                };
            },

            logout_func (token) {
                return {
                    logout: baseUrl + '/api/logout?token=' + token
                };
            }

        };
    }

})();