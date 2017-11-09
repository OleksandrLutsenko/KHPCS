;(function () {
    'use strict';
    angular.module('app')
        .controller('UserManagementController', UserManagementController);

    UserManagementController.$inject = ['userService', '$state', '$mdDialog'];

    function UserManagementController(userService, $state, $mdDialog) {
        let vm = this;



        vm.customers = userService.getCustomers();

        // if(vm.customers === 404){
        //     vm.customers = [];
        // }
        // console.log(vm.customers, 'customers arr');

        vm.showAdvanced = function (id, index) {

            $mdDialog.show({
                controller: DialogController,
                controllerAs: 'vm',
                templateUrl: 'templates/user-management/addClient.html',
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
                        });
                    }
                };

                vs.cancel = function () {
                    $mdDialog.cancel();
                };
            }
        };
    }}());