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
            userService.login(vm.data).then(function (res) {
                if (res.success){
                    userService.setToken(res.data.token);
                    userService.loadUser().then(function () {
                        userService.loadItems().then(function () {
                            $state.go('tab.user-management');
                            toastr.success('Login successful');
                        })
                    })
                }
                else {
                    console.log('error');
                }
            })
        }
    }
})();