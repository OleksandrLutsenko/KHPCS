;(function () {
    angular
        .module('factory.survey', [])
        .factory('survey', survey);

    survey.$inject = ['$localStorage', '$sessionStorage', 'userService'];

    function survey($localStorage, $sessionStorage, userService) {
        let model = {};
        model.setQuestion = setQuestion;
        model.getQuestion = getQuestion;
        model.setActineSurvey = setActineSurvey;
        model.getActineSurvey = getActineSurvey;
        model.setActiveBlock = setActiveBlock;
        model.getActiveBlock = getActiveBlock;
        model.getActiveQuestionair = getActiveQuestionair;

        return model;

        function setQuestion(items) {
            delete $sessionStorage['survey_question'];
            $sessionStorage['survey_question'] = items;
        }
        function getQuestion() {
            return $sessionStorage['survey_question'];
        }

        function setActineSurvey(id, indexSurvey) {
            delete $sessionStorage['active_survey_id'];
            delete $sessionStorage['active_survey_index'];
            $sessionStorage['active_survey_id'] = id;
            $sessionStorage['active_survey_index'] = indexSurvey;
        }
        function getActineSurvey() {
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
            let items = userService.getItems();

            for (let index = 0; index < items.length; index++){
                if(items[index].status == 1){
                    return index;
                }
            }
        }


    }

})();