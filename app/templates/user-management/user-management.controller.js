;(function () {
    'use strict';
    angular.module('app')
        .controller('UserManagementController', UserManagementController);

    UserManagementController.$inject = ['userService', '$state', '$mdDialog'];

    function UserManagementController(userService, $state, $mdDialog) {
        let vm = this;
        vm.myLimit = 5;
        vm.myPage = 1;

        vm.customers = userService.getCustomers();

        vm.deleteCustomer = function (id, index) {
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
                                vm.customers.splice(index, 1);
                                vs.cancel();
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

        vm.addCustomer = function (id, index) {

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
                        name: vm.customers[index].name,
                        surname: vm.customers[index].surname,
                        classification: vm.customers[index].classification
                    }
                }

                vs.saved = function () {
                    console.log(id, vs.data);
                    if(typeof id != 'undefined') {
                        userService.updateCustomers(id, vs.data).then(function (res) {
                            if (res.success) {
                                console.log(res, 'succes');
                                vm.customers.splice(index, 1, res.data);
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
                                console.log(res, 'succes');
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
}}());