;(function () {
    'use strict';

    angular
        .module('service.userService', [])
        .service('userService', userService);

    userService.$inject = ['http', 'url', '$localStorage', '$sessionStorage'];

    function userService(http, url, $localStorage, $sessionStorage) {
        let model = {};
        model.login = login;
        model.getToken = getToken;
        model.setToken = setToken;
        model.loadUser = loadUser;
        model.getUser = getUser;


        model.registration = registration;
        model.forgot = forgot;
        model.reset = reset;
        model.updateInfo = updateInfo;
        model.updatePass = updatePass;
        model.loadItems = loadItems;
        model.setItems = setItems;
        model.getItems = getItems;

        //Survey
        model.loadSurveyOnly = loadSurveyOnly;
        model.getSurveyOnly = getSurveyOnly;

        model.loadOneSurvey = loadOneSurvey;


        // ContractResearch
        model.createNewResearch = createNewResearch;
        model.removeResearch = removeResearch;

        // contractEditor
        model.createTemplate = createTemplate;
        model.loadAllTemplates = loadAllTemplates;
        model.loadTemplateList = loadTemplateList;
        model.removeTemplate = removeTemplate;
        model.updateTemplate = updateTemplate;
        model.createVariability = createVariability;
        model.editVariability = editVariability;
        model.removeVariability = removeVariability;
        model.getVariability = getVariability;

        //DownloadContract
        model.getContract = getContract;
        model.removePdf = removePdf;

        return model;

        function login(credentials) {
            return http.post(url.user.login, credentials)
        }
        function setToken(token) {
            $localStorage.token = token;
        }
        function getToken() {
            return $localStorage.token;
        }
        function loadUser() {
            return http.get(url.user.loadUser, {}).then(function (res) {
                if (res.success){
                    setUser(res.data.result)
                }
                else {
                    //need to show error msg
                }
            })
        }
        function setUser(user) {
            $localStorage.user = user;
        }
        function getUser() {
            return $localStorage.user;
        }

        function registration(credentials) {
            return http.post(url.user.register, credentials)
        }

        function forgot(data) {
            return http.post(url.user.forgot, data);
        }

        function reset(token , data){
            return http.post(url.reset_func(token).resetPass , data);
        }

        function updateInfo(id , dataInfo) {
            return http.post(url.user_func(id).updateProfile , dataInfo);
        }

        function updatePass(id , data) {
            return http.post(url.user_func(id).updateProfile , data);
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
        function loadOneSurvey(id) {
            return http.get(url.survey_management_func(id).loadOneSurvey, {});
        }

        function loadSurveyOnly() {
            return http.get(url.survey_management_func().loadOnlySurvey, {}).then(function (res) {
                if(res.success){
                    setSurveyOnly(res.data.result);
                    return res;
                }
            });
        }
        function setSurveyOnly(data) {
            delete $sessionStorage['survey_only'];
            $sessionStorage['survey_only'] = data;
        }
        function getSurveyOnly() {
            return $sessionStorage['survey_only'];
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

        function loadTemplateList() {
            return http.get(url.contract_editor_func().getTemplateList);
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
        function getContract(idReport, idContract, filename) {
            return http.get(url.contract_download_func(idReport, idContract, filename).downloadPDF);
        }
        function removePdf(idReport) {
            return http.delete(url.contract_download_func(idReport).removePDF);
        }
    }
})();