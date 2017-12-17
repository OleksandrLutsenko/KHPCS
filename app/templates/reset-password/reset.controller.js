;(function () {
    'use strict';
    angular.module('app')
        .controller('ResetController', ResetController);

    ResetController.$inject = ['userService', '$state' , 'toastr' ];

    function ResetController(userService, $state , toastr ) {
        let vm = this;

        vm.reset = reset;

        function reset() {

            userService.reset(vm.data).then(function (res) {
                if (res.success) {
                    toastr.success('Password was changed');
                    $state.go('login');
                }
                else {
                    console.log('error');
                }
            })
        }
    }
})();