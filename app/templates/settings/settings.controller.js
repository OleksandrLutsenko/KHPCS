;(function () {
    'use strict';

    angular.module('app')
        .controller('SettingsController', SettingsController);



    SettingsController.$inject = ['userService', 'survey'];

    function SettingsController(userService, survey) {
        let vm = this;

        // vm.showSurvey = showSurvey;
        //
        // vm.items = userService.getItems();
        //
        // function showSurvey(id, indexSurvey) {
        //     survey.setActineSurvey(id, indexSurvey);
        // }
    }
})();