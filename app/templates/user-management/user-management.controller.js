;(function () {
    'use strict';
    angular.module('app')
        .controller('UserManagementController', UserManagementController);

    UserManagementController.$inject = ['userService', 'customerService', '$state', '$mdDialog', 'customers', 'toastr'];


    function UserManagementController(userService, customerService, $state, $mdDialog, customers, toastr) {
        let vm = this;

        vm.myLimit = 10;
        vm.myPage = 1;

        vm.customers = customerService.getCustomers();

        vm.pass = pass;
        vm.deleteCustomer = deleteCustomer;
        vm.createOrUpdate = createOrUpdate;
        vm.user = userService.getUser();

        function pass(id) {
            customers.setActiveCustomers(id);
            userService.loadSurveyOnly().then(function () {
                $state.go('tab.passing-question');
            })
        }

        function annonce(id) {
            $mdDialog.show({
                controller: 'AnnonceController',
                controllerAs: 'vm',
                templateUrl: 'components/user-management/addClient/annonce.html',
                clickOutsideToClose: true
            }).then(function () {
                pass(id);
            });
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
                        });
                        toastr.success('Delete success');
                    }
                    else {
                        console.log('error');
                    }
                });
            });
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
                    });
                    toastr.success('Edit success');
                }
                else {
                    vm.customers.push(res.data);
                    annonce(res.data.id);
                }
            });
        }

        vm.downloadPDF = function (customer) {
            userService.loadSurveyOnly().then(function (res) {
                let surveys = res.data.result;
                userService.loadAllTemplates().then(function (templateList) {
                    // userService.loadTemplateList().then(function (templateList) {
                    let templates = templateList.data;
                    // console.log('reports = ', customer.reports);
                    // console.log('surveys = ', surveys);
                    // console.log('templates = ', templates);

                    let dataFromDialog = {
                        customer: customer.name + ' ' + customer.surname,
                        reports: customer.reports,
                        surveys: surveys,
                        templates: templates
                    };
                    console.log(dataFromDialog);
                    downloadContractDialog(dataFromDialog);


                    function downloadContractDialog(dataFromDialog) {
                        $mdDialog.show({
                            controller: 'DialogViewController',
                            controllerAs: 'vm',
                            templateUrl: 'components/contract-editor/download-contract/dialog/dialog.html',
                            clickOutsideToClose: true,
                            locals: {
                                dataFromDialog: {
                                    customer: dataFromDialog.customer,
                                    reports: dataFromDialog.reports,
                                    surveys: dataFromDialog.surveys,
                                    templates: dataFromDialog.templates
                                }
                            }
                        });
                    }

                });
            });
        };
    }
}());