;(function () {
    'use strict';
    angular
        .module('app')
        .controller('ExitAfterPassingController', ExitAfterPassingController);

    ExitAfterPassingController.$inject = ['data', '$mdDialog', '$state'];

    function ExitAfterPassingController( data, $mdDialog, $state) {
        let vm = this;

        vm.cancel = cancel;
        vm.exit = exit;
        vm.data = data.data;

        function cancel() {
            $mdDialog.cancel()
        }

        function exit() {
            $state.go('tab.user-management');
            $mdDialog.cancel()
        }
    }
})();