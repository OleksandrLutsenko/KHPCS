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
                console.log(res);
                if (res.status){
                    userService.setUser(res.data);
                    $state.go('tab');
                }
            })
        }
    }
})();