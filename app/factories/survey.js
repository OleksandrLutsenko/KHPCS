;(function () {
    angular
        .module('factory.survey', [])
        .factory('survey', survey);

    survey.$inject = ['$localStorage', '$sessionStorage', 'surveyService'];

    function survey($localStorage, $sessionStorage, surveyService) {
        let model = {};
        model.setActiveSurvey = setActiveSurvey;
        model.getActiveSurvey = getActiveSurvey;
        model.setActiveBlock = setActiveBlock;
        model.getActiveBlock = getActiveBlock;

        model.getActiveQuestionair = getActiveQuestionair;

        return model;


        function setActiveSurvey(id, indexSurvey) {
            delete $sessionStorage['active_survey_id'];
            delete $sessionStorage['active_survey_index'];
            $sessionStorage['active_survey_id'] = id;
            $sessionStorage['active_survey_index'] = indexSurvey;
        }
        function getActiveSurvey() {
            let tmpObj = {
                id: $sessionStorage['active_survey_id'],
                indexSurvey: $sessionStorage['active_survey_index']
            };
            return  tmpObj;
        }


        function setActiveBlock(id, indexBlock) {
            delete $sessionStorage['active_block_id'];
            delete $sessionStorage['active_block_index'];
            $sessionStorage['active_block_id'] = id;
            $sessionStorage['active_block_index'] = indexBlock;
        }
        function getActiveBlock() {
            let tmpObj = {
                id: $sessionStorage['active_block_id'],
                indexBlock: $sessionStorage['active_block_index']
            };
            return  tmpObj;
        }

        function getActiveQuestionair() {
            let items = surveyService.getSurveyOnly();
            for (let index = 0; index < items.length; index++){
                if(items[index].survey_status == 'active'){
                    let tmpObl = {
                        id: items[index].survey_id,
                        index: index
                    };
                    return tmpObl;
                }
            }
        }
    }

})();