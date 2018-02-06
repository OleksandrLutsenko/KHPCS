;(function () {
    'use strict';
    angular
        .module('app')
        .controller('AddClientController', AddClientController);

    AddClientController.$inject = ['data', '$mdDialog', 'customerService', 'customers', '$state', 'surveyService', 'companyService', 'userService', 'contractService', 'survey', 'toastr'];

    function AddClientController( data, $mdDialog, customerService, customers, $state, surveyService, companyService, userService, contractService, survey, toastr) {
        let vm = this;

        vm.save = save;
        vm.cancel = cancel;
        vm.continue = continueQuest;
        vm.pass = pass;

        vm.surveys = data.surveys;




        contractService.loadTemplateList().then(function (res) {
            if (res.success) {
                vm.templates = res.data.contractsWithoutBody;
            } else {
                console.log('load templates error');
            }
        });



        vm.customers = customerService.getCustomers();
        vm.user = userService.getUser();

        if (vm.user.role_id == 2) {
            vm.companies = [];
            companyService.allCompanies().then(function (res) {
                  vm.companies = res.data.companies;
                }
            );
        }

        let id = data.id;
        vm.id = id;
        let customersUser = data.customers;

        if (typeof id != 'undefined') {
            vm.data = {
                name: customersUser.name,
                surname: customersUser.surname,
                classification: customersUser.classification,
                company_id: customersUser.company_id
            }
            vm.user.update = true;
        } else{
            vm.user.update = false;
        }

        function pass(id) {
            survey.selectedSurveys(vm.chosenSurvey);
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
                        } else {
                            cancel();
                        }
                    });
                }
                else {
                    customerService.createCustomers(vm.data).then(function (res) {
                        if (res.success) {
                            if((vm.chosenSurvey.length === 0) || (!vm.goThrough)){
                                let tmpObj = {
                                    type: 'create',
                                    data: res.data
                                };
                                $mdDialog.hide(tmpObj);
                            } else {
                                userService.setPackData(vm.chosenTemplates, res.data);
                                toastr.success('User was created');
                                vm.pass(res.data.id);
                                cancel();
                            }
                        } else {
                            cancel();
                        }
                    });
                }
            }
        }


        ///____________________Process _________________
        vm.goThrough = false;

        vm.noneTmp = function (surv_id) {
            let status = true;
            for (let index in vm.templates) {
                if (vm.templates[index].survey_id === surv_id) {
                    status = false;
                    break;
                }
            }
            return status;
        };

        ///____________________Psssing _________________

        vm.survModel = [];

        vm.chosenSurvey = [];
        vm.chooseSurveys = function (survey_id) {
            if (vm.survModel[survey_id] === true) {
                vm.chosenSurvey.push(survey_id);
            } else {
                for (let survey in vm.chosenSurvey) {
                    if (vm.chosenSurvey[survey] === survey_id) {
                        vm.chosenSurvey.splice(survey, 1);
                        break;
                    }
                }
                for (let survey in vm.chosenTemplates){
                    if (vm.chosenTemplates[survey].survey_id === survey_id) {
                        vm.chosenTemplates.splice(survey, 1);
                        break;
                    }
                }
            }
        };

        ///____________________Download _________________

        vm.templateModel = [];
        vm.chosenTemplates = [];


        vm.chooseTemplates = function (survey_id, survey_name, template_id, template_title) {
            let templateSurvay = {
                survey_id: survey_id,
                survey_name: survey_name,
                template_id: template_id,
                template_title: template_title
            }

            if (!vm.chosenTemplates.length){
                vm.chosenTemplates.push(templateSurvay);
            } else {
                for (let survey in vm.chosenTemplates){
                    if (vm.chosenTemplates[survey].survey_id === survey_id) {
                        vm.chosenTemplates.splice(survey, 1);
                        break;
                    }
                }
                vm.chosenTemplates.push(templateSurvay);
            }
        };


    }
})();