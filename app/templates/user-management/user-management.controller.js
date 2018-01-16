;(function () {
    'use strict';
    angular.module('app')
        .controller('UserManagementController', UserManagementController);

    UserManagementController.$inject = ['userService', 'surveyService', 'customerService', '$state', '$mdDialog', 'customers', 'toastr', 'tabsService', 'survey', 'surveyOnly', 'contractService'];


    function UserManagementController(userService, surveyService, customerService, $state, $mdDialog, customers, toastr, tabsService, survey, surveyOnly, contractService) {
        let vm = this;
        tabsService.startTab('page1');

        vm.myLimit = 10;
        vm.myPage = 1;

        let firstCustomers = customerService.getCustomers();

        let idSurvey = survey.getActiveQuestionair().id;

        function activeStatus() {
            firstCustomers.forEach(function (itemCustomer) {
                itemCustomer.reports.forEach(function(itemReport){
                    if(itemReport.survey_id == idSurvey){
                        itemCustomer.continue = true;
                    }
                });
            });
        }

        activeStatus();

        vm.customers = firstCustomers;

        vm.pass = pass;
        vm.deleteCustomer = deleteCustomer;
        vm.createOrUpdate = createOrUpdate;
        vm.downloadPDF = downloadPDF;
        vm.user = userService.getUser();

        // if(customers.getfinishQuestionair()){
        //
        //     let tmpObj;
        //     let id = customers.setActiveCustomers();
        //
        //     for(let i = 0; i < vm.customers.length; i++){
        //         if(id == vm.customers[i].id){
        //             tmpObj = vm.customers[i];
        //             break
        //         }
        //     }
        //
        //     console.log('id', id);
        //     console.log('tmp', tmpObj);
        //
        //     vm.downloadPDF(tmpObj);
        // }

        function pass(id) {
            customers.setActiveCustomers(id);
            surveyService.loadSurveyOnly().then(function () {
                $state.go('tab.passing-question');
            });
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


        function deleteCustomer(id, customers) {
            $mdDialog.show({
                controller: 'DeleteViewController',
                controllerAs: 'vm',
                templateUrl: 'components/deleteView/deleteView.html',
                clickOutsideToClose: true
            }).then(function () {
                customerService.deleteCustomers(id).then(function (res) {
                    if (res.success) {
                        vm.customers.splice(vm.customers.indexOf(customers), 1);
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
                if (res.type === 'update') {
                    vm.customers.splice(vm.customers.indexOf(customers), 1, res.data);
                    activeStatus();
                    toastr.success('Edit success');
                } else {
                    vm.customers.push(res.data);
                    annonce(res.data.id);
                }
            });
        }

        function downloadPDF(customer) {
            surveyService.loadSurveyOnly().then(function (res) {
                let surveys = res.data.onlySurvey;
                contractService.loadTemplateList().then(function (templateList) {
                    // console.log(templateList.data.contractsWithoutBody);
                    let templates = templateList.data.contractsWithoutBody;
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