;(function () {
    'use strict';
    angular.module('app')
        .controller('CompanyManagementController', CompanyManagementController);

    CompanyManagementController.$inject = ['companyService', 'company' , '$state', '$mdDialog', 'toastr', 'tabsService' ];


    function CompanyManagementController(companyService, company ,  $state, $mdDialog, toastr, tabsService  ) {
        let vm = this;
        tabsService.startTab('page1');

        vm.createCompany = createCompany;
        vm.deleteCompany = deleteCompany;
        vm.setActiveCompany = setActiveCompany;

        vm.company = companyService.getCompany().companies;
        console.log(vm.company);

        function setActiveCompany(id, indexCompany ) {
            console.log(id, indexCompany);
            company.setActiveCompany(id,  indexCompany );
        }

        function createCompany() {
            $mdDialog.show({
                controller: 'AddCompanyController',
                controllerAs: 'vm',
                templateUrl: 'components/company-management/add-company/add-company.html',
                clickOutsideToClose: true,
            }).then(function (res) {
                if (res.type === 'create') {
                    vm.company.push(res.data.company);
                    toastr.success('Company was created');
                }
            });
        }

        function deleteCompany(id , company) {
            $mdDialog.show({
                controller: 'DeleteViewController',
                controllerAs: 'vm',
                templateUrl: 'components/deleteView/deleteView.html',
                clickOutsideToClose: true
            }).then(function () {
                companyService.companyDel(id).then(function (res) {
                    if (res.success) {
                        vm.company.splice(vm.company.indexOf(company), 1);
                        toastr.success('Company was deleted');
                    }
                    else {
                        console.log('error')
                    }
                });
            })
        }

    }
}());