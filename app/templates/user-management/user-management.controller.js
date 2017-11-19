;(function () {
    'use strict';
    angular.module('app')
        .controller('UserManagementController', UserManagementController);

    UserManagementController.$inject = ['userService', '$state', '$mdDialog', 'customers'];

    function UserManagementController(userService, $state, $mdDialog, customers) {
        let vm = this;

        vm.myLimit = 10;
        vm.myPage = 1;

        vm.customers = userService.getCustomers();

        vm.pass = pass;
        vm.deleteCustomer = deleteCustomer;
        vm.createOrUpdate = createOrUpdate;

        function pass(id) {
            customers.setActiveCustomers(id);
            $state.go('tab.passing-question');
        }

        function cancel() {
            $mdDialog.cancel();
        }

        function deleteCustomer(id, index) {
            $mdDialog.show({
                controller: deleteController,
                controllerAs: 'vm',
                locals: {
                    data: {
                        id: id,
                        index: index
                    }
                },
                templateUrl: 'components/user-management/deleteCustomer.html',
                clickOutsideToClose: true
            })
        }
        function deleteController(data) {
            let vmd = this;

            let id = data.id;
            let index = data.index;

            vmd.delete = function () {
                userService.deleteCustomers(id).then(function (res) {
                    if (res.success) {
                        vm.customers.splice(index, 1);
                        cancel();
                    }
                    else {
                        console.log('error');
                    }
                })
            }
        }

        function createOrUpdate(id, index) {
            $mdDialog.show({
                controller: DialogController,
                controllerAs: 'vm',
                locals: {
                    data: {
                        id: id,
                        index: index
                    }
                },
                templateUrl: 'components/user-management/addClient.html',
                clickOutsideToClose: true
            })
        }
        function DialogController(data) {
            let vmd = this;

            let id = data.id;
            let index = data.index;

            if(typeof id !== 'undefined') {
                vmd.data =  {
                    name: vm.customers[index].name,
                    surname: vm.customers[index].surname,
                    classification: vm.customers[index].classification
                }
            }

            vmd.save = function () {
                if(typeof id !== 'undefined') {
                    userService.updateCustomers(id, vmd.data).then(function (res) {
                        if (res.success) {
                            vm.customers.splice(index, 1, res.data);
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
                    });
                }
            };
        }
    }
}());