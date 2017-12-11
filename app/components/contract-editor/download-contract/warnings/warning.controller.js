;(function () {
    'use strict';
    angular
        .module('app')
        .controller('WarningViewController', WarningViewController);

    WarningViewController.$inject = ['$mdDialog', 'data'];

    function WarningViewController($mdDialog, data) {
        let vm = this;

        vm.data = data.text;
        console.log(vm.data);

        vm.cancel = function() {
            $mdDialog.cancel();
        };
    }
})();