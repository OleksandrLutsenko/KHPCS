;(function () {
    'use strict';
    angular.module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['userService', '$localStorage', '$state' , 'toastr'];

    function LoginController(userService, $localStorage, $state , toastr) {
        let vm = this;

        vm.login = login;

        let token = $localStorage.token;

        function login() {
            userService.setToken(undefined);
            if(vm.loginForm.$invalid){
                return;
            }
            else{
                userService.login(vm.data).then(function (res) {
                    if (res.success){
                        userService.setToken(res.data.token);
                        userService.loadUser().then(function () {
                            userService.loadItems().then(function () {
                                $state.go('tab.user-management');
                            })
                        })
                    }
                    else {
                        toastr.error('Please try again', 'Login or password is invalid');
                    }
                })
            }

        }
    }
})();