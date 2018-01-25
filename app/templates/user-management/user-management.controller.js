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

        vm.customers = customerService.getCustomers();

        vm.pass = pass;
        vm.deleteCustomer = deleteCustomer;
        vm.createOrUpdate = createOrUpdate;
        vm.downloadPDF = downloadPDF;
        vm.checkStatus = checkStatus;
        vm.user = userService.getUser();

        vm.surveys = surveyOnly.data.onlySurvey;

        if (vm.surveys !== undefined) {
            vm.survModel = [];
            vm.surveys.forEach(function (survey) {
                vm.survModel[survey.survey_id] = false;
            });
        }

        vm.chosenSurvey = [];
        vm.chooseSurveys = function (survey_id) {
            if (vm.survModel[survey_id] === true) {
                vm.chosenSurvey.push(survey_id);
            } else {
                for (let survey in vm.chosenSurvey) {
                    if (vm.chosenSurvey[survey] === survey_id) {
                        vm.chosenSurvey.splice(survey, 1);
                    }
                }
            }
        };

        vm.clearCheck = function () {
            if (vm.surveys !== undefined) {
                if (vm.checkSelect === undefined) {
                    vm.chosenSurvey = [];
                    vm.surveys.forEach(function (survey) {
                        vm.survModel[survey.survey_id] = false;
                        survey.check = false;
                    });
                    survey.selectedSurveys(vm.chosenSurvey);
                }
            }
        };
        survey.selectedSurveys(vm.chosenSurvey);

        function checkStatus(customers) {
            vm.surveys.forEach(function (survey) {
                customers.reports.forEach(function (check) {
                     if(survey.survey_id === check.survey_id){
                         survey.check = true;
                     }
                 })
                }
            );
            console.log(vm.surveys);
        }

        function pass(id, checkSelect) {
            checkSelect = true;
            vm.checkSelect = checkSelect;
            customers.setActiveCustomers(id);
            surveyService.loadSurveyOnly().then(function () {
                $state.go('tab.passing-question');
            });
        }

        // function annonce(id) {
        //     $mdDialog.show({
        //         controller: 'AnnonceController',
        //         controllerAs: 'vm',
        //         templateUrl: 'components/user-management/addClient/annonce.html',
        //         clickOutsideToClose: true
        //     }).then(function () {
        //         pass(id);
        //     });
        // }

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
            }, function () {

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
                    toastr.success('Edit success');
                } else {
                    vm.customers.unshift(res.data);
                    // annonce(res.data.id);
                }
            }, function () {

            });
        }

        function downloadPDF(customer) {
            surveyService.loadSurveyOnly().then(function (res) {
                let surveys = res.data.onlySurvey;
                contractService.loadTemplateList().then(function (templateList) {
                    let templates = templateList.data.contractsWithoutBody;
                    let dataFromDialog = {
                        customer: customer.name + ' ' + customer.surname,
                        reports: customer.reports,
                        surveys: surveys,
                        templates: templates
                    };
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