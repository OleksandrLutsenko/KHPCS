;(function () {
    'use strict';
    angular.module('app')
        .controller('SignController', SignController);

    SignController.$inject = ['userService', '$state'];

    function SignController(userService, $state) {
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