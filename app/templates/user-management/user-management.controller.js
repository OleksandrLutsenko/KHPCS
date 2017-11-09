;(function () {
    'use strict';
    angular.module('app')
        .controller('UserManagementController', UserManagementController);

    UserManagementController.$inject = ['userService', '$state', '$mdDialog'];

    function UserManagementController(userService, $state, $mdDialog) {
        let vm = this;
            vm.myLimit = 10;
            vm.myPage = 1;

        vm.customers = userService.getCustomers();

        vm.deleteCustomer = function (id, index) {
            $mdDialog.show({
                controller: deleteController,
                controllerAs: 'vm',
                templateUrl: 'templates/user-management/deleteCustomer.html',
                clickOutsideToClose: true
            });
            console.log('ad');
            function deleteController($mdDialog) {
                let vs = this;

                vs.delete = function () {
                    if (typeof id != 'undefined') {
                        userService.deleteCustomers(id).then(function (res) {

                            if (res.success ) {
                                console.log(res, 'succesDelete');
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

        vm.showAdvanced = function (id, index) {

            $mdDialog.show({
                controller: DialogController,
                controllerAs: 'vm',
                templateUrl: 'templates/user-management/addClient.html',
                clickOutsideToClose: true
            });

            function DialogController($mdDialog) {
                let vs = this;

                if (typeof id != 'undefined') {
                    vs.data = {
                        name: vm.customers[index].name,
                        surname: vm.customers[index].surname,
                        classification: vm.customers[index].classification
                    }
                }

                vs.saved = function () {
                    console.log(id, vs.data);
                    if (typeof id != 'undefined') {
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

                                $mdDialog.show(
                                    $mdDialog.alert()
                                        .clickOutsideToClose(true)
                                        .title('New client created')
                                        .textContent('Answering the questionnaire should inform the user what pension they should be choosing.')
                                        .ariaLabel('Alert Dialog Demo')
                                        .ok('Get started!')

                                );

                        });
                    }
                };
                vs.cancel = function () {
                    $mdDialog.cancel();
                };
            }
        };

    }
}());