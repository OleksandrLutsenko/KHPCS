;(function () {
    'use strict';
    angular.module('app')
        .controller('UserManagementController', UserManagementController);

    UserManagementController.$inject = ['userService', '$state', '$mdDialog', 'customers'];


    function UserManagementController(userService, $state, $mdDialog, customers) {
        let vm = this;

        vm.myLimit = 10;
        vm.myPage = 1;

        vm.time = new Date();
        vm.all = vm.time.getDate() + "." + (vm.time.getMonth() +1)  + "." + vm.time.getFullYear();

        vm.customers = userService.getCustomers();

        vm.pass = pass;
        vm.deleteCustomer = deleteCustomer;
        vm.createOrUpdate = createOrUpdate;
        vm.user = userService.getUser();

        function pass(id) {
            customers.setActiveCustomers(id);
            $state.go('tab.passing-question');
        }

        function cancel() {
            $mdDialog.cancel();
        }

        function annonce() {
            $mdDialog.show({
                controllerAs: 'vm',
                templateUrl: 'components/user-management/addClient/annonce.html',
                clickOutsideToClose: true
            })

        }

        function deleteCustomer(id) {
            $mdDialog.show({
                controller: deleteController,
                controllerAs: 'vm',
                locals: {
                    data: {
                        id: id
                    }
                },
                templateUrl: 'components/deleteView/deleteView.html',
                clickOutsideToClose: true
            })
        }

        function deleteController(data) {
            let vmd = this;

            let id = data.id;

            vmd.cancel = function () {
                $mdDialog.cancel();
            };

            vmd.delete = function () {
                userService.deleteCustomers(id).then(function (res) {
                    if (res.success) {
                        userService.loadCustomers().then(function () {
                            vm.customers = userService.getCustomers();
                        });
                        cancel();
                    }
                    else {
                        console.log('error');
                    }
                })

            };

        }

        function createOrUpdate(id, index, customers) {
            $mdDialog.show({
                controller: DialogController,
                controllerAs: 'vm',
                locals: {
                    data: {
                        id: id,
                        index: index,
                        customers: customers
                    }
                },
                templateUrl: 'components/user-management/addClient/addClient.html',
                clickOutsideToClose: true
            })
        }

        function DialogController(data) {
            let vmd = this;

            let id = data.id;
            vmd.id = id;
            let customers = data.customers;

            if (typeof id !== 'undefined') {
                vmd.data = {
                    name: customers.name,
                    surname: customers.surname,
                    classification: customers.classification
                }
            }

            vmd.cancel = function () {
                $mdDialog.cancel();
            };

            vmd.save = function () {
                if (typeof id !== 'undefined') {
                    userService.updateCustomers(id, vmd.data).then(function (res) {
                        if (res.success) {
                            userService.loadCustomers().then(function () {
                                vm.customers = userService.getCustomers();
                            });
                        }
                        else {
                            console.log('error');
                        }
                        cancel();
                    });
                }
                else {
                    userService.createCustomers(vmd.data).then(function (res) {
                        if (res.success) {
                            vm.customers.push(res.data);
                        }
                        else {
                            console.log('error');
                        }
                        cancel();
                        annonce();
                    });
                }
            };

        }

    }
}());