;(function () {
    'use strict';

    angular
        .module('service.userService', [])
        .service('userService', userService);

    userService.$inject = ['http', 'url', '$localStorage', '$sessionStorage'];

    function userService(http, url, $localStorage, $sessionStorage) {
        let model = {};
        model.login = login;
        model.registration = registration;
        model.forgot = forgot;
        model.reset = reset;
        model.setUser = setUser;
        model.getUser = getUser;
        model.loadItems = loadItems;
        model.setItems = setItems;
        model.getItems = getItems;

        //Survey
        model.loadSurveyOnly = loadSurveyOnly;
        model.createSurvey = createSurvey;
        model.updateSurvey = updateSurvey;
        model.deleteSurvey = deleteSurvey;
        model.changeStatusSurvey = changeStatusSurvey;
        model.archiveStatusSurvey = archiveStatusSurvey;
        model.createBlock = createBlock;
        model.updateBlock = updateBlock;
        model.deleteBlock = deleteBlock;

        //Passing questions
        model.sendCustomerAnswer = sendCustomerAnswer;
        model.getCustomerAnswer = getCustomerAnswer;
        model.createReport = createReport;

        // ContractResearch
        model.createNewResearch = createNewResearch;
        model.removeResearch = removeResearch;

        // contractEditor
        model.createTemplate = createTemplate;
        model.loadAllTemplates = loadAllTemplates;
        model.removeTemplate = removeTemplate;
        model.updateTemplate = updateTemplate;
        model.createVariability = createVariability;
        model.editVariability = editVariability;
        model.removeVariability = removeVariability;
        model.getVariability = getVariability;

        //DownloadContract
        model.downloadContract = downloadContract;

        return model;

        function login(credentials) {
            return http.post(url.user.login, credentials)
        }

        function registration(credentials) {
            return http.post(url.user.register, credentials)
        }

        function forgot(credentials) {
            return http.post(url.user.forgot, credentials);
        }

        function reset(credentials){
            return http.post(url.user.reset, credentials);
        }

        function setUser(user) {
            $localStorage.user = user;
        }

        function getUser() {
            return $localStorage.user;
        }

        function loadItems() {
            return http.get(url.user.getItems, {}).then(function (res) {
                if (res.success) {
                    setItems(res.data);
                } else {
                    //need to show error msg
                }
            });
        }
        function setItems(items) {
            delete $sessionStorage['user_items'];
            $sessionStorage['user_items'] = items;
        }
        function getItems() {
            return $sessionStorage['user_items'];
        }




        // Survey management
        function loadSurveyOnly() {
            return http.get(url.survey_management_func().loadOnlySurvey);
        }

        function createSurvey (credentials) {
            return http.post(url.survey_management.createSurvey, credentials);
        }

        function updateSurvey(id, data) {
            return http.put(url.survey_management_func(id).updateSurvey, data);
        }

        function deleteSurvey(id) {
            return http.delete(url.survey_management_func(id).updateSurvey);
        }

        function changeStatusSurvey (id) {
            return http.put(url.survey_management_func(id).changeStatusSurvey);
        }

        function archiveStatusSurvey (id) {
            return http.put(url.survey_management_func(id).archiveStatusSurvey);
        }

        function createBlock(id, credentials) {
            return http.post(url.survey_management_func(id).createBlock, credentials);
        }

        function deleteBlock(id) {
            return http.delete(url.survey_management_func(id).updateBlock);
        }

        function updateBlock(id, data) {
            return http.put(url.survey_management_func(id).updateBlock, data);
        }


        //Pasing question
        function sendCustomerAnswer(id, data) {
            return http.post(url.customers_func(id).sendCustomerAnswer, data);
        }

        function getCustomerAnswer(id) {
            return http.get(url.customers_func(id).getCustomerAnswer, {});
        }

        function createReport(data) {
            return http.post(url.report.createReport, data);
        }

        // ContractResearch
        function createNewResearch() {
            return http.post(url.contract_research_func().createResearch);
        }
        function removeResearch(id) {
            return http.delete(url.contract_research_func(id).deleteResearch);
        }

        // contractEditor
        function createTemplate(id, data) {
            return http.post(url.contract_editor_func(id).createSurveyTemplate, data);
        }

        function loadAllTemplates() {
            return http.get(url.contract_editor_func().getTemplates);
        }

        function removeTemplate(id) {
            return http.delete(url.contract_editor_func(id).deleteTemplate);
        }

        function updateTemplate(id, data) {
            return http.put(url.contract_editor_func(id).updateTemplate, data);
        }
        ///////////

        function createVariability(data) {
            return http.post(url.contract_editor_func().createVariability, data);
        }

        function editVariability(id, data) {
            return http.put(url.contract_editor_func(id).editVariability, data);
        }

        function removeVariability(id) {
            return http.delete(url.contract_editor_func(id).deleteVariability);
        }

        function getVariability() {
            return http.get(url.contract_editor_func().getVariability);
        }

        //DownloadContract
        function downloadContract(idReport, idContract) {
            return http.get(url.contract_download_func(idReport, idContract).downloadPDF);
        }
    }
})();