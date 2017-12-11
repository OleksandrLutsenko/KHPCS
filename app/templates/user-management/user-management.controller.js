;(function () {
    'use strict';
    angular.module('app')
        .controller('UserManagementController', UserManagementController);

    UserManagementController.$inject = ['userService', 'customerService', '$state', '$mdDialog', 'customers', 'toastr'];


    function UserManagementController(userService, customerService, $state, $mdDialog, customers, toastr) {
        let vm = this;

        vm.myLimit = 10;
        vm.myPage = 1;

        vm.time = new Date();
        vm.all = vm.time.getDate() + "." + (vm.time.getMonth() +1)  + "." + vm.time.getFullYear();

        vm.customers = customerService.getCustomers();

        vm.pass = pass;
        vm.deleteCustomer = deleteCustomer;
        vm.createOrUpdate = createOrUpdate;
        vm.user = userService.getUser();

        function pass(id) {
            customers.setActiveCustomers(id);
            $state.go('tab.passing-question');
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

        vm.downloadPDF = function (reports, neededSurveyId) {
            console.log(reports);
            userService.loadSurveyOnly().then(function (res) {
                let surveys = res.data.result;
                console.log(surveys);
                let neededSurveyId = 4;
                let accessToCheckTemplates = false;
                let reportId;
                let templateId;

                if (!surveys.length) {
                    warning('Ууупс,нет ни одного опросника... Куууда подевались? оО');
                } else if (surveys.length) {
                    for (let i=0; i<surveys.length; i++) {
                        if (surveys[i].survey_id === neededSurveyId){
                            accessToCheckTemplates = true;
                            console.log('accessToCheckTemplates = ' + accessToCheckTemplates);
                            break;
                        }
                    }
                }

                if (reports.length > 1 && accessToCheckTemplates === true) {
                    console.log('Больше одного репорта');
                    // warning('Больше одного репорта');
                    selectReport('из')
                    //Вызов диалогового окна для выбора контракта



                } else if (reports.length === 1 && accessToCheckTemplates === true) {
                    reportId = reports[0].id;
                    console.log('reportId = ' + reportId);
                    userService.loadAllTemplates().then(function (templateList) {
                        // userService.loadTemplateList().then(function (templateList) {
                        let templates = templateList.data;
                        let tmpTempaltes = [];
                        console.log(templates);

                        templates.forEach(function (item) {
                            if (item.survey_id === reports[0].survey_id) {
                                tmpTempaltes.push(item);
                            }
                        });
                        console.log('tmpTempaltes = ', tmpTempaltes);

                        if (!tmpTempaltes.length) {
                            warning('Нет шаблонов для даного контракта, сначала сделайте шаблон!');
                            // Вставить окно для оповещения об отсутствии шаблона
                        } else {
                            if (tmpTempaltes.length > 1) {
                                console.log('Больше одного шаблона');
                            } else if (tmpTempaltes.length === 1) {
                                templateId = tmpTempaltes[0].id;
                                console.log('templateId = ' + templateId);
                                download(reportId, templateId);
                            }
                        }
                    });

                }


                function selectReport(data) {

                    $mdDialog.show({
                        controller: 'SelectReportController',
                        controllerAs: 'vm',
                        templateUrl: 'components/contract-editor/download-contract/select-report/select-report.html',
                        clickOutsideToClose: true,
                        locals: {
                            data: {
                                text: data
                            }
                        }
                    });
                }

                function warning(data) {

                    $mdDialog.show({
                        controller: 'SelectReportController',
                        controllerAs: 'vm',
                        templateUrl: 'components/contract-editor/download-contract/warnings/warning.html',
                        clickOutsideToClose: true,
                        locals: {
                            data: {
                                text: data
                            }
                        }
                    });
                }

                function download(reportId, templateId) {
                    userService.getContract(reportId, templateId).then(function (res) {
                        console.log(res);
                        // userService.downloadPdf("some link");
                    });
                }
            });
        };
    }
}());