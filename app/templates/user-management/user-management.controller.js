;(function () {
    'use strict';
    angular.module('app')
        .controller('UserManagementController', UserManagementController);

    UserManagementController.$inject = ['userService', '$state', '$mdDialog', 'customers'];

    function UserManagementController(userService, $state, $mdDialog, customers) {
        let vm = this;
        vm.myLimit = 5;
        vm.myPage = 1;

        vm.go = go;

        vm.customers = userService.getCustomers();

        function go(id) {
            customers.setActiveCustomers(id);
            $state.go('tab.passing-question');
        }

        vm.addCustomer = function (id, index, customers) {

            $mdDialog.show({
                controller: DialogController,
                controllerAs: 'vm',
                templateUrl: 'components/user-management/addClient/addClient.html',
                clickOutsideToClose: true
            });

            function DialogController($mdDialog) {
                let vs = this;

                if(typeof id != 'undefined') {
                    vs.data =  {
                        name: customers.name,
                        surname: customers.surname,
                        classification: customers.classification
                    };
                    console.log(id);
                }

                vs.saved = function () {
                    console.log(id, vs.data);
                    if(typeof id != 'undefined') {
                        userService.updateCustomers(id, vs.data).then(function (res) {
                            if (res.success) {
                                console.log(res, 'succes');
                                userService.loadCustomers().then(function () {
                                    vm.customers = userService.getCustomers();
                                    $mdDialog.cancel();
                                });
                            }
                            else {
                                console.log('error');
                            }
                            vs.cancel();
                        });
                    }
                    else {
                        userService.createCustomers(vs.data).then(function (res) {
                            if (res.success) {
                                console.log(res, 'crea');
                                vm.customers.push(res.data);
                            }
                            else {
                                console.log('error');
                            }
                            vs.cancel();

                            $mdDialog.show({
                                controller: DialogController,
                                controllerAs: 'vm',
                                templateUrl: 'components/user-management/addClient/annonce.html',
                                clickOutsideToClose: true
                            });
                        });
                    }
                };

                vs.cancel = function () {
                    $mdDialog.cancel();
                };
            }
        };

        vm.deleteCustomer = function (id) {
            $mdDialog.show({
                controller: deleteController,
                controllerAs: 'vm',
                templateUrl: 'components/user-management/deleteCustomer/deleteCustomer.html',
                clickOutsideToClose: true
            });

            function deleteController($mdDialog) {
                let vs = this;

                vs.delete = function () {
                    if (typeof id != 'undefined') {
                        userService.deleteCustomers(id).then(function (res) {
                            if (res.success) {

                                vs.cancel();
                                userService.loadCustomers().then(function () {
                                    vm.customers = userService.getCustomers();
                                    $mdDialog.cancel();
                                });
                            }
                            else {
                                console.log('errorDelete');
                            }
                        });
                    }
                    else {
                        console.log('deleteError');
                    }
                };

                vs.cancel = function () {
                    $mdDialog.cancel();
                };
            }
        };
    }}());