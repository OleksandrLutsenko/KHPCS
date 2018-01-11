;(function () {
    'use strict';
    angular
        .module('app')
        .controller('AddAdminController', AddAdminController);

    AddAdminController.$inject = ['$mdDialog', '$state', 'companyService'];

    function AddAdminController($mdDialog, $state, companyService) {
        let vm = this;

        vm.save = save;
        vm.cancel = cancel;

        function cancel() {
            $mdDialog.cancel()
        }


        console.log(vm.data);
        vm.data = {
            email: '',
            role_id: '',
            company_id: '28'
        };

        function save() {

            vm.data.role_id = vm.data.role;
            if (vm.adminForm.$invalid) {
                return;
            }
            else {
                companyService.inviteAdm(vm.data).then(function (res) {
                    if (res.success) {
                        console.log(vm.data);
                        let tmpObj = {
                            type: 'create',
                            data: res.data
                        };
                        $mdDialog.hide(tmpObj);
                    }
                    else {
                        cancel();
                    }
                });
            }
        }
    }
})();