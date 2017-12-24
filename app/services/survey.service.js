;(function () {
    'use strict';

    angular
        .module('service.surveyService', [])
        .service('surveyService', surveyService);

    surveyService.$inject = ['http', 'url' , '$sessionStorage'];

    function surveyService(http, url ,  $sessionStorage) {
        let model = {};

        model.loadItems = loadItems;
        model.setItems = setItems;
        model.getItems = getItems;

        model.loadSurveyOnly = loadSurveyOnly;
        model.getSurveyOnly = getSurveyOnly;

        model.loadOneSurvey = loadOneSurvey;


        model.createSurvey = createSurvey;
        model.updateSurvey = updateSurvey;
        model.deleteSurvey = deleteSurvey;
        model.changeStatusSurvey = changeStatusSurvey;
        model.archiveStatusSurvey = archiveStatusSurvey;

        return model;

        function loadItems() {
            return http.get(url.user.getItems, {}).then(function (res) {
                if (res.success) {
                    setItems(res.data);
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

        function loadOneSurvey(id) {
            return http.get(url.survey_management_func(id).loadOneSurvey, {});
        }

        ////////////////////////////////
        function loadSurveyOnly() {
            return http.get(url.survey_management_func().loadOnlySurvey, {}).then(function (res) {
                if(res.success){
                    setSurveyOnly(res.data.result);
                    return res.data.result;
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


        /////////////////////////////////////
        function createSurvey (data) {
            return http.post(url.survey_management.createSurvey, data);
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

    }
})();