;(function () {
    'use strict';
    angular.module('app')
        .controller('CompanyController', CompanyController);

    CompanyController.$inject = ['assignST', 'loadSurvey', 'loadTemp', 'userService', 'companyService', 'oneCompany', 'company', '$mdDialog', 'toastr', 'tabsService', 'customersCompany'];


    function CompanyController(assignST, loadSurvey, loadTemp, userService, companyService, oneCompany, company, $mdDialog, toastr, tabsService, customersCompany) {
        let vm = this;
        tabsService.startTab('page2');

        vm.myLimit = 10;
        vm.myPage = 1;

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

        if (vm.userRole === 2) {
            vm.surveys = loadSurvey.data.onlySurvey;
            vm.templates = loadTemp.data.contractsWithoutBody;

            let assignTemplates = assignST.data;
            vm.templateModel = [];
            vm.templates.forEach(function (template) {
                for (let at in assignTemplates) {
                    if (template.id !== assignTemplates[at].contract_id) {
                        vm.templateModel[template.id] = false;
                    } else {
                        vm.templateModel[template.id] = true;
                        break;
                    }
                }
            });

            vm.checkboxTemplates = function (survey_id, templateID) {
                let companyID = vm.companyOne.id;
                let tmpData;
                if (vm.templateModel[templateID] === true) {
                    tmpData = [{
                        survey_id: survey_id,
                        contract_id: templateID
                    }];
                    companyService.assign(companyID, tmpData);
                } else {
                    tmpData = [{
                        survey_id: survey_id,
                        contract_id: templateID,
                        delete: true
                    }];
                    companyService.assign(companyID, tmpData);
                }
            };
        }

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

        function changeFA(id, user_id) {
            vm.data = [{
                id: id,
                user_id: user_id
            }];
            companyService.changeFA(vm.data).then(function (res) {
                if (res.success) {
                    let id = company.getActiveCompany().id;
                    companyService.companyCustomers(id).then(function (res) {
                        vm.customersCompany = res.data;
                    });
                    toastr.success('Financial adviser was changed');
                }
            });
        }

        function createAdmin(role) {
            $mdDialog.show({
                controller: 'AddAdminController',
                controllerAs: 'vm',
                templateUrl: 'components/company-management/add-admin/add-admin.html',
                clickOutsideToClose: true,
                locals: {
                    data: {
                        id: vm.companyOne.id,
                        role: role
                    }
                }
            }).then(function (res) {

                if (res.data.role_id == 3) {
                    for (let index in vm.companyAdmInv) {
                        if (vm.companyAdmInv[index].email !== res.data.email) {
                                vm.companyAdmInv.unshift(res.data);
                            }
                            break;
                    }

                } else {
                    for (let index in vm.fnnAdviserInv) {
                        if (vm.fnnAdviserInv[index].email !== res.data.email) {
                            vm.fnnAdviserInv.unshift(res.data);
                        }
                        break;
                    }

                }
                toastr.success('Email was sent');
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
                if (user.is_used == undefined) {
                    companyService.deleteAdmin(id).then(function (res) {
                        if (res.success) {
                            if (user.role_id === 1) {
                                vm.fnnAdviser.splice(vm.fnnAdviserInv.indexOf(user), 1);
                            } else {
                                vm.companyAdm.splice(vm.companyAdm.indexOf(user), 1);
                            }
                            toastr.success('User was deleted');
                        }

                    });
                } else {
                    companyService.cancelInv(id).then(function (res) {
                        if (res.success) {
                            if (user.role_id == 1) {
                                vm.fnnAdviserInv.splice(vm.fnnAdviserInv.indexOf(user), 1);
                            } else {
                                vm.companyAdmInv.splice(vm.companyAdmInv.indexOf(user), 1);
                            }
                            toastr.success('User was deleted');
                        }

                    });
                }
            })
        }
    }
}());