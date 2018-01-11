;(function () {
    'use strict';
    angular.module('app')
        .controller('CompanyController', CompanyController);

    CompanyController.$inject = ['companyService', '$state', '$mdDialog', 'toastr', 'tabsService'];


    function CompanyController(companyService, $state, $mdDialog, toastr, tabsService) {
        let vm = this;
        tabsService.startTab('page1');

        console.log('company');

        vm.createAdmin = createAdmin;

        function createAdmin() {
            $mdDialog.show({
                controller: 'AddAdminController',
                controllerAs: 'vm',
                templateUrl: 'components/company-management/add-admin/add-admin.html',
                clickOutsideToClose: true,
            }).then(function (res) {
                if (res.type === 'create') {
                    toastr.success('Message was sent');
                }
            });
        }

    }
}());