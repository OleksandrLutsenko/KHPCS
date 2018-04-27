;(function () {
    'use strict';
    angular.module('app')
        .controller('CompanyController', CompanyController);

    CompanyController.$inject = ['loadSurvey', 'loadTemp', '$scope', 'assignST', 'userService', 'companyService',
        'oneCompany', 'company', '$mdDialog', 'toastr', 'customersCompany', 'risks', 'riskService'];


    function CompanyController(loadSurvey, loadTemp, $scope, assignST, userService, companyService,
                               oneCompany, company, $mdDialog, toastr, customersCompany, risks, riskService) {
        let vm = this;
        $scope.$emit('changeTab', 'page2');

        vm.myLimit = 10;
        vm.myPage = 1;

        vm.customersCompany = customersCompany.data;
        vm.user = userService.getUser();
        vm.userRole = vm.user.role_id;
        vm.companyOne = oneCompany;
        vm.risks = [];
        vm.availableSurveys = [];

        vm.companyAdm = vm.companyOne.company_admin;
        vm.companyAdmInv = vm.companyOne.company_admin_invites;
        vm.fnnAdviser = vm.companyOne.financial_advisors;
        vm.fnnAdviserInv = vm.companyOne.financial_advisors_invites;

        vm.createAdmin = createAdmin;
        vm.deleteAdmin = deleteAdmin;
        vm.reSend = reSend;
        vm.changeFA = changeFA;

        vm.riskTabOpen = riskTabOpen;
        vm.riskNewPole = riskNewPole;
        vm.riskDeleteRange = riskDeleteRange;
        vm.riskRefresh = riskRefresh;
        vm.riskSave = riskSave;

        vm.riskRegular = riskRegular;
        vm.riskMoreFunc = riskMoreFunc;
        vm.riskLessFunc = riskLessFunc;

        let riskTemplates =[];

        if (vm.userRole === 2) {

            vm.surveys = loadSurvey.data.onlySurvey;
            vm.templates = loadTemp.data.contractsWithoutBody;

            let assignTemplates = assignST.data;
            riskTemplates = assignST.data;
            vm.templateModel = [];
            vm.templateSendOnMailModel = [];
            console.log('vm.templates = ', vm.templates);
            console.log('assignTemplates = ', assignTemplates);
            vm.templates.forEach(function (template, index) {

                for (let at in assignTemplates) {
                    if (template.id !== assignTemplates[at].contract_id && template.survey_id === assignTemplates[at].survey_id) {
                        vm.templateModel[index] = false;
                        vm.templateSendOnMailModel[index] = false;
                    } else {
                        if (template.survey_id === assignTemplates[at].survey_id) {
                            vm.templateModel[index] = true;
                            if (assignTemplates[at].send_email === 1) {
                                vm.templateSendOnMailModel[index] = true;
                            }
                            break;
                        }
                    }
                }
            });

            if (risks.success) {
                vm.risks = risks.data
            }

            vm.checkboxTemplates = function (survey_id, template_id, template_index, type) {
                let company_id = vm.companyOne.id;
                let data = {
                    survey_id: survey_id,
                    contract_id: template_id
                };

                if (type === 'template') {
                    if (vm.templateModel[template_index] === true) {
                        sendTemplate();
                    } else {
                        data.delete = true;
                        sendTemplate();
                    }

                } else if (type === 'mail') {
                    data.company_id = company_id;
                    if (vm.templateSendOnMailModel[template_index]) {
                        sendMail('activate');
                    } else {
                        sendMail('deactivate');
                    }
                }

                function sendTemplate() {
                    companyService.assign(company_id, [data]).then(function (res) {
                        if (res.success) {
                            riskTemplates = res.data.assigned;

                            if (data.delete) {
                                vm.templateSendOnMailModel[template_index] = false;
                            }
                        }
                    });
                }

                function sendMail(type) {
                    companyService.sendEmail(data, type).then(function (res) {
                        if (res.success) {
                            changeActiveMail();
                        }
                    });
                }
                
                function changeActiveMail() {
                    for (let i=0; i<vm.templates.length; i++) {
                        let template = vm.templates[i];

                        if (survey_id === template.survey_id) {
                            if (template_index !== i) {
                                vm.templateSendOnMailModel[i] = false;
                            }
                        }
                    }
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
                    if (vm.user.role_id === 3) {
                        let id = vm.user.company_id;
                        vm.id = id;
                    } else {
                        let id = company.getActiveCompany().id;
                        vm.id = id;
                    }
                    companyService.companyCustomers(vm.id).then(function (res) {
                        vm.customersCompany = res.data;
                        toastr.success('Financial adviser was changed');
                    });
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
                    vm.companyAdmInv.unshift(res.data);
                } else {
                    vm.fnnAdviserInv.unshift(res.data);
                }
                toastr.success('Email was sent');
            }, function () {

            });
        }

        function reSend(user) {
            vm.data = {
                email: user.email,
                role_id: user.role_id,
                company_id: user.company_id
            };
            companyService.reSend(vm.data).then(function (res) {
                if (res.success) {
                    toastr.success('Email was sent');
                }
            });
        }

        function deleteAdmin(id, user) {
            $mdDialog.show({
                controller: 'DeleteViewController',
                controllerAs: 'vm',
                templateUrl: 'components/delete-view/delete-view.html',
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
            }, function () {

            })
        }



        function riskTabOpen() {
            searchAvailableSurveys();
            risksAdding();
        }

        function searchAvailableSurveys() {
            vm.availableSurveys = [];
            riskTemplates.forEach(function (template) {
                for (let i = 0; i < vm.surveys.length; i++) {
                    let survey = vm.surveys[i];

                    if (template.survey_id === survey.survey_id) {
                        let status = true;
                        // survey.risks = [];
                        survey.working_risks_value = [];
                        survey.refresh_risks_value = [];

                        for (let i=0; i<vm.availableSurveys.length; i++) {
                            let availableSurvey = vm.availableSurveys[i];
                            if (availableSurvey.survey_id === survey.survey_id) {
                                status = false;
                            }
                        }

                        if (status) {
                            vm.availableSurveys.push(survey);
                            break;
                        }
                    }
                }
            });
        }

        function risksAdding() {
            vm.availableSurveys.forEach(function (survey) {
                let tmpArr = [];
                vm.risks.forEach(function (risk) {
                    if (risk.survey_id === survey.survey_id) {
                        tmpArr.push(risk)
                    }
                });
                // console.log('tmpArr = ', tmpArr);
                sortRisk();
                arrBuilder();

                function sortRisk() {
                    function compareMinRange(riskA, riskB) {
                        return riskA.min_range - riskB.min_range;
                    }

                    tmpArr.sort(compareMinRange);
                }

                function arrBuilder() {
                    let arr = tmpArr;
                    let workingArr = survey.working_risks_value;
                    let refreshArr = survey.refresh_risks_value;
                    arr.forEach(function (obj) {
                        let tmpObj = {
                            id: obj.id,
                            condition: null,
                            value: null,
                            description: obj.description,
                            survey_id: obj.survey_id,
                            company_id: obj.company_id
                        };

                        if (obj.max_range === null) {
                            if (arr.length === 1) {
                                tmpObj.value = obj.min_range;
                            } else {
                                tmpObj.value = obj.min_range - 1;
                            }
                            tmpObj.condition = 'more'
                        } else {
                            tmpObj.value = obj.max_range;
                            tmpObj.condition = 'less'
                        }

                        workingArr.push(angular.copy(tmpObj));
                        refreshArr.push(angular.copy(tmpObj));
                    });
                }

            });
        }


        function riskNewPole(surveysIndex, surveyId) {
            let arr = vm.availableSurveys[surveysIndex].working_risks_value;
            let maximumNumberOfRisks = 20;

            if (arr.length) {
                if (arr.length < maximumNumberOfRisks) {
                    if (arr[arr.length - 1].condition !== 'more') {
                        let tmpObj = {
                            company_id: oneCompany.id,
                            survey_id: surveyId,
                            condition: 'less',
                            value: arr[arr.length - 1].value + 1,
                            description: null
                        };

                        arr.push(tmpObj);
                    } else {
                        console.log('Incorrect action!');
                    }
                } else {
                    console.log('Maximum number of risks(' + maximumNumberOfRisks + ') exceeded!');
                }
            } else {
                let tmpObj = {
                    company_id: oneCompany.id,
                    survey_id: surveyId,
                    condition: 'less',
                    value: 0,
                    description: null
                };

                arr.push(tmpObj);
            }
        }

        function riskDeleteRange(riskIndex, surveyIndex) {
            let arr = vm.availableSurveys[surveyIndex].working_risks_value;
            if (riskIndex !== arr.length - 1) {
                console.log('not last');
                if (arr[riskIndex + 1].condition === 'more') {
                    if (arr.length > 2) {
                        arr[riskIndex + 1].value = arr[riskIndex - 1].value
                    } else {
                        arr[riskIndex + 1].value = 0;
                    }
                }
                arr.splice(riskIndex, 1);
                console.log(arr);
            } else {
                console.log('last');
                arr.splice(riskIndex, 1);
                console.log(arr);
            }
        }

        function riskRefresh(index) {
            let survey = vm.availableSurveys[index];
            angular.copy(survey.refresh_risks_value, survey.working_risks_value);
        }

        function riskSave(surveyIndex, surveyId) {
            let arr = vm.availableSurveys[surveyIndex].working_risks_value;
            let refreshArr = vm.availableSurveys[surveyIndex].refresh_risks_value;
            let companyId = oneCompany.id;
            let risksNumber = null;
            let idArr = [];
            let removeArr = [];
            let dataForSend = [];

            collectionOfAllIdentifiers();
            dataConversionBeforeSending();
            removalOfUnnecessaryRisks();
            createAndUpdateRisks();


            //Сбор всех ID
            function collectionOfAllIdentifiers() {
                refreshArr.forEach(function (risk) {
                    if (risk.id) {
                        idArr.push(angular.copy(risk.id))
                    }
                });
                // console.log('idArr = ', angular.copy(idArr));
            }

            //Преобразование данных для отправки на сервер
            function dataConversionBeforeSending() {
                arr.forEach(function (obj, index) {
                    let tmpObj = {
                        min_range: null,
                        max_range: null,
                        description: obj.description,
                        company_id: companyId,
                        survey_id: surveyId,
                    };

                    if (index !== 0) {
                        if (arr[index].condition === 'less') {
                            tmpObj.min_range = arr[index - 1].value + 1;
                            tmpObj.max_range = arr[index].value;
                        } else if (arr[index].condition === 'more') {
                            tmpObj.min_range = arr[index - 1].value;
                        }
                    } else {
                        if (arr[index].condition === 'less') {
                            tmpObj.min_range = 0;
                            tmpObj.max_range = obj.value;
                        } else if (arr[index].condition === 'more') {
                            tmpObj.min_range = 0;
                        }
                    }

                    dataForSend.push(tmpObj);
                });
                // console.log('dataForSend', angular.copy(dataForSend));
            }

            //Удаление лишних рисков
            function removalOfUnnecessaryRisks() {
                for (let i=0; i<idArr.length; i++) {
                    if (i < dataForSend.length) {
                        dataForSend[i].id = idArr[i];
                    } else {
                        risksNumber = i;
                        break;
                    }
                }
                if (risksNumber) {
                    removeArr = angular.copy(idArr);
                    removeArr.splice(0, risksNumber);
                    removeArr.forEach(function (risk) {
                        riskService.deleteRisk(risk).then(function (res) {
                            if (res.success) {
                                let data = res.data;
                                updateRisksArr(data, 'delete');
                            }
                        })
                    })
                } else if (!dataForSend.length && idArr.length) {
                    removeArr = angular.copy(idArr);
                    removeArr.forEach(function (risk) {
                        riskService.deleteRisk(risk).then(function (res) {
                            if (res.success) {
                                let data = res.data;
                                updateRisksArr(data, 'delete');
                            }
                        })
                    })
                }
            }

            //Создание или обновление рисков
            function createAndUpdateRisks() {
                // console.log('dataForSend.length = ', dataForSend.length);

                let survey = vm.availableSurveys[surveyIndex];
                if (dataForSend.length) {
                    dataForSend.forEach(function (risk, riskIndex) {
                        let riskRange = survey.working_risks_value[riskIndex];

                        if (risk.id) {
                            // console.log('update risk ', risk.id);
                            riskService.updateRisk(risk.id, risk).then(function (res) {
                                if (res.success) {
                                    let data = res.data;
                                    updateRisksArr(data, 'update');
                                }
                            })

                        } else {
                            // console.log('create risk');
                            riskService.createRisk(risk).then(function (res) {
                                if (res.success) {
                                    let data = res.data;
                                    updateRisksArr(data, 'create');
                                }
                                riskRange.id = res.data.id;
                            })
                        }
                    });

                    angular.copy(survey.working_risks_value, survey.refresh_risks_value);

                } else {
                    survey.working_risks_value = [];
                    survey.refresh_risks_value = [];
                }
            }

            function updateRisksArr(data, type) {
                if (type === 'delete') {
                    for (let i = 0; i < vm.risks.length; i++) {
                        let risk = vm.risks[i];
                        if (risk.id === data.id) {
                            vm.risks.splice(i, 1);
                            break;
                        }
                    }
                } else if (type === 'update') {
                    for (let i = 0; i < vm.risks.length; i++) {
                        let risk = vm.risks[i];
                        if (risk.id === data.id) {
                            vm.risks.splice(i, 1, data);
                            break;
                        }
                    }

                } else if (type === 'create') {
                    vm.risks.push(data);
                }
            }
        }


        function riskRegular(riskIndex, surveysIndex) {
            let arr = vm.availableSurveys[surveysIndex].working_risks_value;
            console.log(arr);

            let str = angular.copy(arr[riskIndex].value);
            // str = str.replace(/\D+/g, "");
            str = Number(str);

            if (riskIndex !== 0) {
                if (arr[riskIndex].condition === 'less') {

                    if (str <= Number(arr[riskIndex - 1].value)) {
                        str = Number(arr[riskIndex - 1].value) + 1;
                    }
                    arr[riskIndex].value = str;

                    if (riskIndex !== arr.length - 1 && arr[riskIndex].value >= arr[riskIndex + 1].value) {
                        riskChangeValue(riskIndex, surveysIndex);
                    }
                }
            } else {
                if (!arr.length) {
                    arr[riskIndex].value = 0
                } else if (Number(arr[riskIndex + 1].value) <= str) {
                    arr[riskIndex + 1].value = Number(arr[riskIndex + 1].value) + 1;
                }


                arr[riskIndex].value = str;
                if (riskIndex + 1 < arr.length - 1) {
                    if (arr[riskIndex].value > arr[riskIndex + 1].value) {
                        riskChangeValue(riskIndex, surveysIndex)
                    }
                }
            }

            function riskChangeValue(index, surveysIndex) {
                let arr = vm.availableSurveys[surveysIndex].working_risks_value;
                console.log('riskChangeValue');
                console.log('index = ', index);
                console.log('arr.length - 1 = ', arr.length - 1);

                for (let i = index; i < arr.length - 1; i++) {

                    if (arr[i + 1].condition === 'less' && arr[i].value >= arr[i + 1].value) {
                        arr[i + 1].value = arr[i].value + 1;

                    } else if (arr[i + 1].condition === 'more' && arr[i].value > arr[i + 1].value) {
                        arr[i + 1].value = arr[i].value;
                    }
                }
            }
        }

        function riskMoreFunc(riskIndex, surveysIndex) {
            let arr = vm.availableSurveys[surveysIndex].working_risks_value;

            arr.splice(riskIndex + 1, arr.length);
            if (riskIndex !== 0) {
                arr[riskIndex].value = arr[riskIndex - 1].value;
            } else {
                arr[riskIndex].value = 0;
            }
        }

        function riskLessFunc(riskIndex, surveysIndex) {
            let arr = vm.availableSurveys[surveysIndex].working_risks_value;

            if (riskIndex !== 0) {
                arr[riskIndex].value = arr[riskIndex - 1].value + 1;
            } else {
                arr[riskIndex].value = 1;
            }
        }
    }
}());