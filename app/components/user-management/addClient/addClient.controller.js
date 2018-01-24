;(function () {
    'use strict';
    angular
        .module('app')
        .controller('AddClientController', AddClientController);

    AddClientController.$inject = ['data', '$mdDialog', 'customerService' , 'customers' , '$state' , 'surveyService' , 'companyService' , 'userService'];

    function AddClientController(data, $mdDialog, customerService , customers, $state , surveyService , companyService , userService) {
        let vm = this;

        vm.id = data.id;
        vm.save = save;
        vm.cancel = cancel;
        vm.continue = continueQuest;
        vm.pass = pass;

        vm.customers = customerService.getCustomers();
        vm.user = userService.getUser();

        // if(vm.user.role_id == 2) {
        //     console.log(vm.user.role_id);
        //     vm.company = companyService.getCompany().companies;
        // }

        let id = data.id;
        vm.id = id;
        let customersUser = data.customers;

        if (typeof id != 'undefined') {
            vm.data = {
                name: customersUser.name,
                surname: customersUser.surname,
                classification: customersUser.classification,
            }
        }

        function pass(id) {
            customers.setActiveCustomers(id);
            surveyService.loadSurveyOnly().then(function () {
                $state.go('tab.passing-question');
            })
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
               return;
            }
            else {

                if (typeof id != 'undefined') {
                    customerService.updateCustomers(id, vm.data).then(function (res) {
                        if (res.success) {
                            let tmpObj = {
                                type: 'update',
                                data: res.data
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