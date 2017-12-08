;(function () {
    'use strict';
    angular.module('app')
        .controller('UserManagementController', UserManagementController);

    UserManagementController.$inject = ['userService', 'customerService', '$state', '$mdDialog', 'customers', 'survey'];


    function UserManagementController(userService, customerService, $state, $mdDialog, customers, survey) {
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
                pass(id)
            })
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
                        })
                    }
                    else {
                        console.log('error')
                    }
                });
            })
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
                    })
                }
                else {
                    vm.customers.push(res.data);
                    annonce(res.data.id)
                }
            })
        }

        vm.downloadPDF = function (reports) {
            console.log(reports);
            userService.loadSurveyOnly().then(function (res) {
                let surveys = res.data.result;
                console.log(res.data.result);
                let activeSurveyId;
                let actualReportId;

                for (let i=0; i<surveys.length; i++) {
                    if (surveys[i].survey_status === 1) {
                        activeSurveyId = surveys[i].survey_id;
                        console.log(activeSurveyId, 'Active survey id');
                    }
                }

                for (let i=0; i<reports.length; i++) {
                    if (activeSurveyId === reports[i].survey_id) {
                        actualReportId = reports[i].id;
                        console.log('совпадение', actualReportId);
                    }
                }

                userService.loadAllTemplates().then(function (res) {
                    console.log(res.data, 'Шаблоны');
                });

                userService.downloadContract(actualReportId, 5).then(function (data) {
                    console.log(data);
                }).save(function () {

                });
                //5 и 7
            });
        };
    }
}());