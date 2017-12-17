;(function () {
    'use strict';
    angular
        .module('app')
        .controller('AddClientController', AddClientController);

    AddClientController.$inject = ['data', '$mdDialog', 'customerService' , 'toastr'];

    function AddClientController(data, $mdDialog, customerService , toastr) {
        let vm = this;

        vm.id = data.id;
        vm.save = save;
        vm.cancel = cancel;

        let id = data.id;
        vm.id = id;
        let customers = data.customers;

        if (typeof id != 'undefined') {
            vm.data = {
                name: customers.name,
                surname: customers.surname,
                classification: customers.classification
            }
        }

        function cancel() {
            $mdDialog.cancel()
        }

        function save() {
            if (vm.customersForm.$invalid) {
               console.log('error');
                toastr.error('Please try again', 'All fields is required');
            }
            else {

                if (typeof id != 'undefined') {
                    customerService.updateCustomers(id, vm.data).then(function (res) {
                        if (res.success) {
                            let tmpObj = {
                                type: 'update'
                            };
                            $mdDialog.hide(tmpObj);
                        }
                        else {
                            cancel();
                        }
                    });
                }
                else {
                    customerService.createCustomers(vm.data).then(function (res) {
                        if (res.success) {
                            let tmpObj = {
                                type: 'create',
                                data: res.data
                            };
                            $mdDialog.hide(tmpObj);
                        }
                        else {
                            cancel();
                        }
                    });
                }
            }
        }
    }
})();