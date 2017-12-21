;(function () {
    'use strict';
    angular
        .module('app')
        .controller('AddClientController', AddClientController);

    AddClientController.$inject = ['data', '$mdDialog', 'customerService' , 'toastr' , 'customers' , '$state'];

    function AddClientController(data, $mdDialog, customerService , toastr , customers, $state) {
        let vm = this;

        vm.id = data.id;
        vm.save = save;
        vm.cancel = cancel;
        vm.continue = continueQuest;
        vm.pass = pass;
        vm.customers = customerService.getCustomers();

        let id = data.id;
        vm.id = id;
        let customersUser = data.customers;

        if (typeof id != 'undefined') {
            vm.data = {
                name: customersUser.name,
                surname: customersUser.surname,
                classification: customersUser.classification
            }
        }

        function pass(id) {
            customers.setActiveCustomers(id);
            $state.go('tab.passing-question');
        }

        function cancel() {
            $mdDialog.cancel()
        }

        function continueQuest() {
            cancel();
            pass(id);
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