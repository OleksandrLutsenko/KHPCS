;(function () {
    'use strict';
    angular.module('app')
        .controller('RegistrationController', RegistrationController);

    RegistrationController.$inject = ['userService', '$state', 'toastr', 'tabsService' , 'http' ];

    function RegistrationController(userService, $state, toastr, tabsService , http ) {
        let vm = this;
        tabsService.startTab('page1');

        vm.register = register;

        vm.user = userService.getUser();



        function register() {
            console.log(vm.data);
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
                        toastr.error(err.data.email.toString());
                    }
                })
            }
        }
    }
})();