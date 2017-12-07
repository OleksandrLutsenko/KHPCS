;(function () {
    'use strict';
    angular.module('app')
        .controller('UserManagementController', UserManagementController);

    UserManagementController.$inject = ['userService', 'customerService', '$state', '$mdDialog', 'customers', 'survey'];


    function UserManagementController(userService, customerService, $state, $mdDialog, customers, survey) {
        let vm = this;

        vm.myLimit = 10;
        vm.myPage = 1;

        vm.time = new Date();
        vm.all = vm.time.getDate() + "." + (vm.time.getMonth() +1)  + "." + vm.time.getFullYear();

        vm.customers = customerService.getCustomers();

        vm.pass = pass;
        vm.deleteCustomer = deleteCustomer;
        vm.createOrUpdate = createOrUpdate;
        vm.user = userService.getUser();

        function pass(id) {
            customers.setActiveCustomers(id);
            $state.go('tab.passing-question');
        }

        function annonce(id) {
            $mdDialog.show({
                controller: 'AnnonceController',
                controllerAs: 'vm',
                templateUrl: 'components/user-management/addClient/annonce.html',
                clickOutsideToClose: true
            }).then(function () {
                pass(id)
            })
        }


        function deleteCustomer(id) {
            $mdDialog.show({
                controller: 'DeleteViewController',
                controllerAs: 'vm',
                templateUrl: 'components/deleteView/deleteView.html',
                clickOutsideToClose: true
            }).then(function () {
                customerService.deleteCustomers(id).then(function (res) {
                    if (res.success) {
                        customerService.loadCustomers().then(function () {
                            vm.customers = customerService.getCustomers()
                        })
                    }
                    else {
                        console.log('error')
                    }
                });
            })
        }

        function createOrUpdate(id, customers) {
            $mdDialog.show({
                controller: 'AddClientController',
                controllerAs: 'vm',
                locals: {
                    data: {
                        id: id,
                        customers: customers,
                    }
                },
                templateUrl: 'components/user-management/addClient/addClient.html',
                clickOutsideToClose: true
            }).then(function (res) {
                if(res.type == 'update'){
                    customerService.loadCustomers().then(function () {
                        vm.customers = customerService.getCustomers();
                    })
                }
                else {
                    vm.customers.push(res.data);
                    annonce(res.data.id)
                }
            })
        }
    }
}());