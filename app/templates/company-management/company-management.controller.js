;(function () {
    'use strict';
    angular.module('app')
        .controller('CompanyManagementController', CompanyManagementController);

    CompanyManagementController.$inject = ['userService',  'customerService', '$state', '$mdDialog', 'customers', 'toastr', 'tabsService' ];


    function CompanyManagementController(userService, customerService, $state, $mdDialog, customers, toastr, tabsService  ) {
        let vm = this;
        tabsService.startTab('page1');

        vm.user = userService.getUser();

        console.log(vm.user);
    }
}());