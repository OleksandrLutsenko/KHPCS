;(function () {
    'use strict';
    angular.module('app')
        .controller('forgotController', forgotController);

    forgotController.$inject = ['userService', '$state'];

    function forgotController(userService, $state) {
        let vm = this;

        vm.forgot = forgot;

        function forgot() {
            userService.forgot(vm.data).then(function (res) {
                if (res.success) {
                    console.log('sent token')
                }
                else {
                    console.log('error');
                }
            })
        }
    }
})();