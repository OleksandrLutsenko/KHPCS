;(function () {
    'use strict';

    angular.module('app')
        .controller('ContractEditorController', ContractEditorController);



    ContractEditorController.$inject = ['userService', '$mdDialog'];

    function ContractEditorController(userService, $mdDialog) {
        let vm = this;
        console.log('contract-editor controller start');

        vm.items = userService.getItems();
        console.log(vm.items);

        userService.getVariability().then(function (res) {
            if(res.success) {
                vm.variability = res.data;
            }else {
                console.log('no variability');
            }
        });

        function loadTemplates() {
            userService.loadAllTemplates().then(function (res) {
                if(res.success) {
                    vm.templates = res.data;
                    console.log(vm.templates, 'vm.templates');

                    vm.availabilityOfTemplates = function () {
                        let tmpStatus = true;

                        for (let i=0; i<vm.templates.length; i++){
                            if (vm.templates[i].survey_id === activeSurveyID) {
                                tmpStatus = false;
                            }
                        }

                        if (tmpStatus === true){
                            return true;
                        } else {
                            return false;
                        }
                    };
                }else {
                    console.log('no variability');
                }
            });
        }
        loadTemplates();

        let activeSurveyID;
        let activeSurveyName;
        let activeBlockId;
        let activeTemplateTitle;
        vm.activeTemplateId = undefined;

        CKEDITOR.replace('CKeditorArea');
        vm.surveyMenuInContractEditor = true;
        vm.contractEditor = false;

        vm.showTemplates = function (id) {
            if (id === activeSurveyID){
                return true;
            } else {
                return false;
            }
        };
        //////////////////////////Поблочный просмотр вопросов(+Тригер)///////////////////
        vm.showQuestionsInBlock = function (idCurrentBlock) {
            if (activeBlockId === idCurrentBlock){
                activeBlockId = undefined;
            } else  {
                activeBlockId = idCurrentBlock;
            }
        };

        vm.showQuestions = function (id) {
            if (activeBlockId === id){
                return true;
            } else {
                return false;
            }
        };
        ///////////////////////////////////////////////////////////////////////////////


        ///////////////////////////////////////////////////////////////////////////////

        vm.setActiveSurvey = function (id, index, name) {
            vm.surveyMenuInContractEditor = false;
            vm.contractEditor = true;
            vm.activeSurvey = vm.items[index];
            activeSurveyID = id;
            activeSurveyName = name;
            console.log(vm.activeSurvey, 'vm.activeSurvey');
        };

        vm.reelectActiveSurvey = function () {
            vm.surveyMenuInContractEditor = true;
            vm.contractEditor = false;
            CKEDITOR.instances.CKeditorArea.setData("");
            activeSurveyID = undefined;
            activeSurveyName = undefined;
            activeBlockId = undefined;
            activeTemplateTitle = undefined;
            vm.activeTemplateId = undefined;
        };

        vm.pasteTitle = function (data) {
            CKEDITOR.instances['CKeditorArea'].insertText(data);
        };

        vm.pasteVariability = function (data, id) {
            CKEDITOR.instances['CKeditorArea'].insertText('{!!$contractAnswers[' + id + ']!!}');
        };


        //////////////////////////////Замена текста////////////////////////////////////
        vm.testReplace = function () {
            let tmpTextData = CKEDITOR.instances.CKeditorArea.getData();
            CKEDITOR.instances.CKeditorArea.setData(tmpTextData.replace(/1/g, '2'));
            console.log(tmpTextData);
        };
        ///////////////////////////////////////////////////////////////////////////////

        /////////////////////////Работа с шаблонами////////////////////////////////////

        vm.pasteTemplate = function (data) {
            vm.activeTemplateId = data.id;
            activeTemplateTitle = data.title;

            let body = data.body.replace("<!doctype html><html lang=\"en\"><head><meta charset=\"UTF-8\"><meta name=\"viewport\"content=\"width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0\"><meta http-equiv=\"X-UA-Compatible\" content=\"ie=edge\"><title>Document</title></head><body>", "").replace("</body></html>", "");
            CKEDITOR.instances.CKeditorArea.setData(body);
        };

        vm.conditionForCreatingNewTemplate = function () {
            vm.activeTemplateId = undefined;
            activeTemplateTitle = undefined;
            CKEDITOR.instances['CKeditorArea'].setData('');
        };

        vm.postTemplate = function () {

            $mdDialog.show({
                controller: createTemplateTitleController,
                controllerAs: 'vm',
                templateUrl: 'components/contract-editor/create-template-title/create-template-title.html',
                clickOutsideToClose: true
            });

            function createTemplateTitleController() {
                let vs = this;

                vs.data = {
                    "title": "",
                    "body": "<!doctype html><html lang=\"en\"><head><meta charset=\"UTF-8\"><meta name=\"viewport\"content=\"width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0\"><meta http-equiv=\"X-UA-Compatible\" content=\"ie=edge\"><title>Document</title></head><body>" + CKEDITOR.instances['CKeditorArea'].getData() + "</body></html>",
                    "survey_id": activeSurveyID
                };

                vs.createTemplate = function () {
                    if (vs.data.title === ""){
                        vs.data.title = 'unnamed template';
                    }
                    userService.createTemplate(vs.data).then(function (res) {
                        console.log(res);
                        if (res.success) {
                            userService.loadAllTemplates().then(function (res) {
                                vm.templates = res.data;
                                CKEDITOR.instances.CKeditorArea.setData("");
                            });
                        }
                    });
                    console.log(vs.data);
                    $mdDialog.cancel();
                };

                vs.close = function () {
                    $mdDialog.cancel();
                };
            }
        };

        vm.updateTemplate = function () {

            $mdDialog.show({
                controller: updateTemplateTitleController,
                controllerAs: 'vm',
                templateUrl: 'components/contract-editor/update-template-title/update-template-title.html',
                clickOutsideToClose: true
            });

            function updateTemplateTitleController() {
                let vs = this;

                vs.data = {
                    title: activeTemplateTitle,
                    body: "<!doctype html><html lang=\"en\"><head><meta charset=\"UTF-8\"><meta name=\"viewport\"content=\"width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0\"><meta http-equiv=\"X-UA-Compatible\" content=\"ie=edge\"><title>Document</title></head><body>" + CKEDITOR.instances['CKeditorArea'].getData() + "</body></html>",
                    survey_id: activeSurveyID
                };
                // console.log(vs.data);

                vs.updateTemplate = function () {
                    if (vs.data.title === ""){
                        vs.data.title = 'unnamed template';
                    }
                    userService.updateTemplate(vm.activeTemplateId, vs.data).then(function (res) {
                        console.log(res);
                        activeTemplateTitle = res.data.contract.title;
                        if (res.success) {
                            userService.loadAllTemplates().then(function (res) {
                                vm.templates = res.data;
                                console.log(res.data, 'Template list');
                            });
                        } else{
                            console.log('Update template error');
                        }
                    });
                    $mdDialog.cancel();
                };

                vs.close = function () {
                    $mdDialog.cancel();
                };
            }
        };

        vm.removeTemplate = function () {
            $mdDialog.show({
                controller: removeTemplateController,
                controllerAs: 'vm',
                templateUrl: 'components/deleteView/deleteView.html',
                clickOutsideToClose: true
            });

            function removeTemplateController($mdDialog) {
                let vs = this;

                vs.delete = function () {
                    userService.removeTemplate(vm.activeTemplateId).then(function (res) {
                        console.log(res);
                        if (res.success) {
                            userService.loadAllTemplates().then(function (res) {
                                vm.templates = res.data;
                                CKEDITOR.instances.CKeditorArea.setData("");
                                vm.activeTemplateId = undefined;
                                // activeTemplateTitle = undefined;
                            });
                        }
                    });
                    $mdDialog.cancel();
                };
                vs.cancel = function () {
                    $mdDialog.cancel();
                };
            }
        };

        ///////////////////////////////////////////////////////////////////////////////


        //////////////////////Работа с пользовательскими переменными///////////////////

        vm.loadVariability = function () {
            userService.getVariability().then(function (res) {
                console.log(res.data, 'Variability list');
                vm.variability = res.data;
            });
        };
        vm.createVariability = function () {
            userService.getVariability().then(function (res) {
                console.log(res, 'Create variability');
            });
        };
        vm.editVariability = function () {
            userService.getVariability().then(function (res) {
                console.log(res, 'Edit variability');
            });
        };
        vm.removeVariability = function () {
            userService.getVariability().then(function (res) {
                console.log(res, 'Remove variability');
            });
        };


        vm.pasteUserVariability = function (id) {
            CKEDITOR.instances['CKeditorArea'].insertText('{!!$variables[' + id + ']->text!!}');
        };

        vm.createUserVariability = function () {

            $mdDialog.show({
                controller: createVariabilityController,
                controllerAs: 'vm',
                templateUrl: 'components/contract-editor/add-user-variability/add-user-variability.html',
                clickOutsideToClose: true
            });

            function createVariabilityController($mdDialog) {
                let vs = this;

                vs.saveVariability = function () {
                    console.log(vs.data);
                    userService.createVariability(vs.data).then(function (res) {
                        console.log(res);
                        if (res.success) {
                            userService.getVariability().then(function (res) {
                                console.log(res.data, 'Variability list');
                                vm.variability = res.data;
                            });
                        } else{
                            console.log('Create user variability error');
                        }
                    });
                    $mdDialog.cancel();
                };
                vs.close = function () {
                    $mdDialog.cancel();
                };
            }
        };

        vm.editUserVariability = function (id, data) {

            $mdDialog.show({
                controller: editVariabilityController,
                controllerAs: 'vm',
                templateUrl: 'components/contract-editor/edit-user-variability/edit-user-variability.html',
                clickOutsideToClose: true
            });

            function editVariabilityController($mdDialog) {
                let vs = this;
                vs.data = {
                    'text': data
                };

                vs.reSaveVariability = function () {
                    console.log('saveVariability');
                    userService.editVariability(id, vs.data).then(function (res) {
                        console.log(res);
                        if (res.success) {
                            userService.getVariability().then(function (res) {
                                console.log(res.data, 'Variability list');
                                vm.variability = res.data;
                            });
                        } else{
                            console.log('Save user variability error');
                        }
                    });
                    $mdDialog.cancel();
                };
                vs.close = function () {
                    $mdDialog.cancel();
                };
            }
        };

        vm.removeUserVariability = function (id) {
            $mdDialog.show({
                controller: removeVariabilityController,
                controllerAs: 'vm',
                templateUrl: 'components/deleteView/deleteView.html',
                clickOutsideToClose: true
            });

            function removeVariabilityController($mdDialog) {
                let vs = this;

                vs.delete = function () {
                    userService.removeVariability(id).then(function (res) {
                        console.log(res);
                        if (res.success) {
                            userService.getVariability().then(function (res) {
                                console.log(res.data, 'Variability list');
                                vm.variability = res.data;
                            });
                        } else{
                            console.log('Remove user variability error');
                        }
                    });
                    $mdDialog.cancel();
                };
                vs.cancel = function () {
                    $mdDialog.cancel();
                };
            }
        };

        ///////////////////////////////////////////////////////////////////////////////


        ///////////////////////////////////Напоминание/////////////////////////////////
        function hint() {
            console.log(CKEDITOR.instances['CKeditorArea'].insertText(), 'Вставить текст в редактор');
            console.log(CKEDITOR.instances['CKeditorArea'].getData(),    'Получить содержимое редактора');
            console.log(CKEDITOR.instances['CKeditorArea'].setData(),    'заменить содержимое редактора');
        }
        ///////////////////////////////////////////////////////////////////////////////
    }
})();