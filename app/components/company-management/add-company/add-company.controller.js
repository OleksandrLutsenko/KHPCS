;(function () {
    'use strict';
    angular
        .module('app')
        .controller('AddCompanyController', AddCompanyController);

    AddCompanyController.$inject = ['companyService' , '$mdDialog', '$state'];

    function AddCompanyController(companyService ,  $mdDialog, $state) {
        let vm = this;

        vm.save = save;
        vm.cancel = cancel;

        function cancel() {
            $mdDialog.cancel()
        }

        function save() {
            if (vm.companyForm.$invalid) {
                return;
            }
            else {
                companyService.createCompany(vm.data).then(function (res) {
                    if (res.success) {
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