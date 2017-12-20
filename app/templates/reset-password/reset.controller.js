;(function () {
    'use strict';
    angular.module('app')
        .controller('ResetController', ResetController);

    ResetController.$inject = ['userService', '$state' , 'toastr' , '$stateParams'];

    function ResetController(userService, $state , toastr , $stateParams) {
        let vm = this;

        vm.reset = reset;

        let token = $stateParams.token;

        function reset() {

            userService.reset(token , vm.data).then(function (res) {
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