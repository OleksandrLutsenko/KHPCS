;(function () {
    'use strict';
    angular.module('app')
        .controller('RegistrationController', RegistrationController);

    RegistrationController.$inject = ['userService', '$state', 'toastr'];

    function RegistrationController(userService, $state, toastr) {
        let vm = this;

        vm.register = register;

        vm.user = userService.getUser();

        function register() {
            if (vm.regForm.$invalid) {
                console.log('err');
            }
            else {
                userService.setToken(undefined);
                userService.registration(vm.data).then(function (res) {
                    if (res.success) {
                        $state.go('login');
                        toastr.success('Registration successful');
                    }
                    else {
                        console.log('eror');
                    }
                })
            }

        }
    }
})();