;(function () {
    'use strict';
    angular.module('app')
        .controller('CompanyController', CompanyController);

    CompanyController.$inject = ['loadSurvey', 'loadTemp', 'userService', 'companyService', 'oneCompany', 'company', '$mdDialog', 'toastr', 'tabsService', 'customersCompany'];


    function CompanyController(loadSurvey, loadTemp, userService, companyService, oneCompany, company, $mdDialog, toastr, tabsService, customersCompany) {
        let vm = this;
        tabsService.startTab('page1');

        vm.customersCompany = customersCompany.data;
        vm.userRole = userService.getUser().role_id;
        vm.companyOne = oneCompany;
        console.log(vm.companyOne);

        vm.companyAdm = vm.companyOne.company_admin;
        vm.companyAdmInv = vm.companyOne.company_admin_invites;
        vm.fnnAdviser = vm.companyOne.financial_advisors;
        vm.fnnAdviserInv = vm.companyOne.financial_advisors_invites;

        vm.createAdmin = createAdmin;
        vm.deleteAdmin = deleteAdmin;
        vm.reSend = reSend;
        vm.changeFA = changeFA;

        function changeFA(id, user_id) {
            vm.data = [{
                id: id,
                user_id: user_id
            }];
            companyService.changeFA(vm.data).then(function (res) {
                if (res.success) {
                    toastr.success('Financial adviser was changed');
                }
            });
        }

        if (vm.userRole === 2) {
            vm.surveys = loadSurvey.data.onlySurvey;
            vm.templates = loadTemp.data.contractsWithoutBody;
        }

        vm.checkboxTemplates = function (survey_id, id) {
            if (document.getElementById(id).checked === true) {
                vm.data = [{
                    survey_id: survey_id,
                    contract_id: id
                }];
                id = vm.companyOne.id;
                companyService.assign(id, vm.data);
            } else {
                vm.data = [{
                    survey_id: survey_id,
                    contract_id: id,
                    delete: true
                }];
                id = vm.companyOne.id;
                companyService.assign(id, vm.data);
            }
        };

        function createAdmin() {
            $mdDialog.show({
                controller: 'AddAdminController',
                controllerAs: 'vm',
                templateUrl: 'components/company-management/add-admin/add-admin.html',
                clickOutsideToClose: true,
                locals: {
                    id: vm.companyOne.id
                }
            }).then(function (res) {
                if (res.success) {
                    if (res.data.data.role_id === 3) {
                        vm.companyAdmInv.push(res.data.data);
                    } else {
                        vm.fnnAdviserInv.push(res.data.data);
                    }
                    toastr.success('Email was sent');
                }

            });
        }

        function reSend(user) {
            vm.data = {
                email: user.email,
                role_id: user.role_id,
                company_id: user.company_id
            };
            companyService.inviteAdm(vm.data).then(function (res) {
                if (res.success) {
                    toastr.success('Email was sent');
                }
            });
        }

        function deleteAdmin(id, user) {
            $mdDialog.show({
                controller: 'DeleteViewController',
                controllerAs: 'vm',
                templateUrl: 'components/deleteView/deleteView.html',
                clickOutsideToClose: true
            }).then(function () {
                if (user.is_used === undefined) {
                    companyService.deleteAdmin(id).then(function (res) {
                        if (res.success) {
                            if (user.role_id === 1) {
                                vm.fnnAdviser.splice(vm.fnnAdviserInv.indexOf(user), 1);
                            } else {
                                vm.companyAdm.splice(vm.companyAdm.indexOf(user), 1);
                            }
                            toastr.success('User was deleted');
                        } else {
                            console.log('error')
                        }
                    });
                } else {
                    companyService.cancelInv(id).then(function (res) {
                        if (res.success) {
                            if (user.role_id === 1) {
                                vm.fnnAdviserInv.splice(vm.fnnAdviserInv.indexOf(user), 1);
                            } else {
                                vm.companyAdmInv.splice(vm.companyAdmInv.indexOf(user), 1);
                            }
                            toastr.success('User was deleted');
                        } else {
                            console.log('error')
                        }
                    });
                }
            })
        }
    }
}());