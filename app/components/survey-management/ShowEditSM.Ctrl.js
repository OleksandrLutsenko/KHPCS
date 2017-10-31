;(function () {
    'use strict';

    angular.module('app')
        .controller('ShowEditSMCtrl', function ($mdDialog) {

            let vm = this;

            vm.cancel = function () {
                $mdDialog.cancel();
            };
            vm.question = question;
            vm.inputCheck = function (inputValueNum) {
                if (inputValueNum === 1) {
                    return false;
                }
                else {
                    return true;
                }
            };




        });

})();