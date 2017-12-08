;(function () {
    'use strict';
    angular.module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['userService', '$state', 'toastr'];

    function LoginController(userService, $state, toastr) {
        let vm = this;

        vm.login = login;

        function login() {
            userService.login(vm.data).then(function (res) {
                if (res.success) {
                    userService.setUser(res.data.user);
                    $state.go('tab.user-management');
                }
                else {
                    toastr.error('Please try again', 'Login or password is invalid');
                    console.log('error');
                }
            })
        }
    }
})();

