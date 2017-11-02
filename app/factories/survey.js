;(function () {
    angular
        .module('factory.survey', [])
        .factory('survey', survey);


    survey.$inject = ['$localStorage', '$sessionStorage'];

    function survey($localStorage, $sessionStorage) {
        let model = {};
        model.setQuestion = setQuestion;
        model.getQuestion = getQuestion;


        return model;

        function setQuestion(items) {
            delete $sessionStorage['survey_question'];
            $sessionStorage['survey_question'] = items;
        }

        function getQuestion() {
            return $sessionStorage['survey_question'];
        }
    }

})();