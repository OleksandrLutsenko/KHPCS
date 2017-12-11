;(function () {
    'use strict';
    angular
        .module('app')
        .controller('SelectReportController', SelectReportController);

    SelectReportController.$inject = ['$mdDialog', 'data'];

    function SelectReportController($mdDialog, data) {
        let vm = this;

        vm.data = data.text;
        console.log(vm.data);

        vm.cancel = function() {
            $mdDialog.cancel();
        };
    }
})();