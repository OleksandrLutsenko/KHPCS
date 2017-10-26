;(function () {
    'use strict';

    angular.module('app')
        .controller('SurveyManagementController', SurveyManagementController);


    SurveyManagementController.$inject = [];

    function SurveyManagementController() {
        let vm = this;

        vm.nameOf = [];

        for(let i = 1; i <= 10; i++){
            vm.nameOf.push('Task ' + i)
        }

        console.log(vm.nameOf);

    }
})();