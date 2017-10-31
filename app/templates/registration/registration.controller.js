;(function () {
    'use strict';
    angular.module('app')
        .controller('RegistrationController', RegistrationController);

    RegistrationController.$inject = ['userService', '$state'];

    function RegistrationController(userService, $state) {
        let vm = this;

        vm.register = register;

        function register() {
            console.log(vm.data);
            userService.registration(vm.data).then(function (res) {
                console.log(res, 'reg ctrl');
                if (res.status){
                    userService.setUser(res.data);
                    $state.go('tab');
                }
                else {
                    console.log('eror');
                }
            })
        }
    }
})();