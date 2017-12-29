;(function () {
    'use strict';

    angular
        .module('service.contractService', [])
        .service('contractService', contractService);

    contractService.$inject = ['http', 'url'];

    function contractService(http, url) {
        let model = {};


        // ContractResearch
        model.createNewResearch = createNewResearch;
        model.removeResearch = removeResearch;

        // ContractTemplates
        model.createTemplate = createTemplate;
        model.loadOneTemplate = loadOneTemplate;
        model.loadTemplateList = loadTemplateList;
        model.loadingTemplatesForThePoll = loadingTemplatesForThePoll;
        model.loadAllTemplates = loadAllTemplates;
        model.removeTemplate = removeTemplate;
        model.updateTemplate = updateTemplate;

        // UserVariability
        model.createVariability = createVariability;
        model.editVariability = editVariability;
        model.removeVariability = removeVariability;
        model.getVariability = getVariability;
        model.getVariabilityWithDeleted = getVariabilityWithDeleted;

        //Upload image
        model.uploadImage = uploadImage;

        return model;

        // ContractResearch
        function createNewResearch() {
            return http.post(url.contract_research_func().createResearch);
        }
        function removeResearch(id) {
            return http.delete(url.contract_research_func(id).deleteResearch);
        }

        // ContractTemplates
        function createTemplate(id, data) {
            return http.post(url.contract_editor_func(id).createSurveyTemplate, data);
        }

        function loadOneTemplate(id) {
            return http.get(url.contract_editor_func(id).getOneTemplate);
        }

        function loadTemplateList() {
            return http.get(url.contract_editor_func().getTemplateList);
        }

        function loadingTemplatesForThePoll(id) {
            return http.get(url.contract_editor_func(id).getTemplatesForThePool);
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

        // UserVariability
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

        function getVariabilityWithDeleted() {
            return http.get(url.contract_editor_func().getVariabilityWithDeleted);
        }

        //Upload image
        function uploadImage(id) {
            return url.contract_editor_func(id).uploadImage;
        }

    }
})();