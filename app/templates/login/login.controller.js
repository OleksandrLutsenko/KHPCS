;(function () {
    'use strict';
    angular.module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['userService', '$state'];

    function LoginController(userService, $state) {
        let vm = this;

        vm.login = login;

        function login() {
            userService.login(vm.data).then(function (res) {
                console.log(res, 'login ctrl');
                if (res.success){
                    userService.setUser(res.data.user);
                    $state.go('tab');
                }
                else {
                    console.log('error');
                }
            })
        }
    }
})();