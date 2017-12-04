;(function () {
    'use strict';
    angular.module('app')
        .controller('RegistrationController', RegistrationController);

    RegistrationController.$inject = ['userService', '$state' , 'toastr'];

    function RegistrationController(userService, $state , toastr) {
        let vm = this;

        vm.register = register;

        function register() {
            console.log(vm.data);
            userService.registration(vm.data).then(function (res) {
                console.log(res, 'reg ctrl');
                if (res.success) {
                    userService.setUser(res.data);
                    $state.go('login');
                    toastr.success('Registration successful');
                }
                else {
                    console.log('eror');
                }
            })
        }
    }
})();