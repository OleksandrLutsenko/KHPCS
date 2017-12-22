;(function () {
    'use strict';
    angular.module('app')
        .controller('ForgotController', ForgotController);

    ForgotController.$inject = ['userService', '$state' , 'toastr'];

    function ForgotController(userService, $state , toastr) {
        let vm = this;

        vm.forgot = forgot;

        function forgot() {
            if(vm.resetForm.$invalid){
                return;
            }
            else {
                userService.forgot(vm.data).then(function (res) {
                    if (res.success) {
                        console.log('sent token');
                        toastr.success('Instructions was sent on your email');
                        $state.go('login');
                    }
                    else {
                        console.log('error');
                    }
                })
            }



        }
    }
})();