;(function () {
    'use strict';
    angular
        .module('app')
        .controller('AddAdminController', AddAdminController);

    AddAdminController.$inject = ['id', '$mdDialog', '$state', 'companyService'];

    function AddAdminController(id, $mdDialog, $state, companyService) {
        let vm = this;

        vm.save = save;
        vm.cancel = cancel;

        function cancel() {
            $mdDialog.cancel()
        }

        vm.data = {
            email: '',
            role_id: '',
            company_id: id,
            is_used: 0
        };

        function save() {

            vm.data.role_id = vm.data.role;
            if (vm.adminForm.$invalid) {
                return;
            }
            else {
                companyService.inviteAdm(vm.data).then(function (res) {
                    if (res.success) {
                            let tmpObj = {
                                type: 'createCompanyAdm',
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