;(function () {
    'use strict';

    angular.module('app')
        .controller('ContractEditorController', ContractEditorController);



    ContractEditorController.$inject = ['userService', '$mdDialog', 'toastr', 'contractService', 'tabsService'];

    function ContractEditorController(userService, $mdDialog, toastr, contractService, tabsService) {
        let vm = this;
        tabsService.startTab('page3');
        console.log('contract-editor controller start');

        vm.surveys = userService.getItems();
        console.log(vm.surveys);

        // userService.getVariability().then(function (res) {
        contractService.getVariabilityWithDeleted().then(function (res) {
            if(res.success) {
                vm.variability = res.data;
                console.log(vm.variability, 'vm.variability');
            }else {
                console.log('no variability');
            }
        });

        // function loadTemplates() {
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
                console.log('load templates error');
            }
        });
        // }
        // loadTemplates();
        //
        let activeSurveyID;
        let activeSurveyName;
        let activeBlockId;
        let activeTemplateTitle;
        let tmpAnswersArr = [];
        vm.activeTemplateId = undefined;
        vm.showTemplateTab = true;
        vm.showSurveyVarTab = false;
        vm.showUserVarTab = false;

        CKEDITOR.replace('CKeditorArea');

        CKEDITOR.addCss('body{width: 21cm;min-height: 29.7cm;border: 1px #D3D3D3 solid;box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);padding: 5px; box-sizing: border-box; margin: 0 auto; font-family: -webkit-pictograph; font-size: 15px !important;line-height: 1.2 !important}');
        CKEDITOR.addCss('body p{margin: 5px 0;}');
        CKEDITOR.addCss('span[lang]{font-style: normal !important;}');

        if (vm.surveys.length) {
            vm.activeSurvey = vm.surveys[0];
            activeSurveyID = vm.surveys[0].id;
            activeSurveyName = vm.surveys[0].name;
            CKEDITOR.instances.CKeditorArea.setData('');
            userService.createNewResearch().then(function (res) {
                tmpResearchId = res.data.id;
            });
        }

        vm.showTemplates = function (id) {
            if (id === activeSurveyID){
                return true;
            } else {
                return false;
            }
        };

        vm.showSelectedSurvey = function (id) {
            if (id === activeSurveyID) {
                return true;
            } else {
                return false;
            }
        };

        vm.showSelectedTemplate = function (id) {
            if (id === vm.activeTemplateId) {
                return true;
            } else {
                return false;
            }
        };

        vm.clickTemplateTab = function () {
            vm.showTemplateTab = true;
            vm.showSurveyVarTab = false;
            vm.showUserVarTab = false;
        };
        vm.clickSurveyVarTab = function () {
            vm.showTemplateTab = false;
            vm.showSurveyVarTab = true;
            vm.showUserVarTab = false;
        };
        vm.clickUserVarTab = function () {
            vm.showTemplateTab = false;
            vm.showSurveyVarTab = false;
            vm.showUserVarTab = true;
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
        let tmpResearchId;

        vm.setActiveSurvey = function setActiveSurvey(id, index, name) {
            vm.activeSurvey = vm.surveys[index];
            // console.log(vm.activeSurvey);
            activeSurveyID = id;
            activeSurveyName = name;

            vm.activeTemplateId = undefined;
            activeTemplateTitle = undefined;
            CKEDITOR.instances.CKeditorArea.setData('');

            console.log(vm.activeSurvey, 'vm.activeSurvey');

            userService.createNewResearch().then(function (res) {
                console.log(res);
                tmpResearchId = res.data.id;
                console.log(tmpResearchId);
            });
        };

        vm.pasteTitle = function (data) {
            CKEDITOR.instances.CKeditorArea.insertText(data);
            // CKEDITOR.instances.CKeditorArea.insertText('[[' + data + ']]' + 'fsdfssdfs' + '[[' + data + ']]');
            // console.log(CKEDITOR.instances.CKeditorArea.getData());

        };

        vm.pasteVariability = function (data, id) {
            // CKEDITOR.instances.CKeditorArea.insertText('{!!$contractAnswers[' + id + ']!!}');
            let surveyVarInEditorSide = '[[Answer ' + id + ']]';
            let surveyVarInServerSide = '{!!$contractAnswers[' + id + ']!!}';
            let tmpVarObj = {
                inServer: surveyVarInServerSide,
                inEditor: surveyVarInEditorSide
            };

            CKEDITOR.instances.CKeditorArea.insertText('[[Answer ' + id + ']] ');

            let coincidence = false;
            if (!tmpAnswersArr.length) {
                tmpAnswersArr.push(tmpVarObj);
            } else {
                tmpAnswersArr.forEach(function (item) {
                    if (item.inServer === surveyVarInServerSide) {
                        coincidence = true;
                    }
                });

                if (coincidence === false) {
                    tmpAnswersArr.push(tmpVarObj);
                }
            }
        };

        /////////////////////////Работа с шаблонами////////////////////////////////////

        vm.pasteTemplate = function (data) {
            vm.activeTemplateId = data.id;
            activeTemplateTitle = data.title;
            tmpAnswersArr = [];

            let body = data.body.replace("<!doctype html><html lang=\"en\"><head><meta charset=\"UTF-8\"><meta name=\"viewport\"content=\"width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0\"><meta http-equiv=\"X-UA-Compatible\" content=\"ie=edge\"><title>Document</title></head><body>", "").replace("</body></html>", "");

            vm.activeSurvey.blocks.forEach(function (block) {
                block.questions.forEach(function (question) {
                    let surveyVarInServerSide = '{!!$contractAnswers[' + question.id + ']!!}';
                    if (body.indexOf(surveyVarInServerSide) !== -1) {
                        let surveyVarInEditorSide = '[[Answer ' + question.id + ']]';
                        let tmpVarObj = {
                            inServer: surveyVarInServerSide,
                            inEditor: surveyVarInEditorSide
                        };
                        tmpAnswersArr.push(tmpVarObj);
                        body = body.split(surveyVarInServerSide).join(surveyVarInEditorSide);
                    }
                });
            });

            vm.variability.forEach(function (variability) {
                let userVarInServerSide;
                let userVarInEditorSide;

                userVarInServerSide = '{!!$userVariables[' + variability.id + ']!!}';

                if (body.indexOf(userVarInServerSide) !== -1) {
                    if (variability.deleted_at !== null) {
                        userVarInEditorSide = '<span style="background-color: red">Variability ' + variability.id + ' was deleted</span>';
                        // console.log(userVarInEditorSide);
                    } else {
                        userVarInEditorSide = '[[User var ' + variability.id + ']]';

                    }
                    let tmpVarObj = {
                        inServer: userVarInServerSide,
                        inEditor: userVarInEditorSide
                    };
                    body = body.split(userVarInServerSide).join(userVarInEditorSide);
                    tmpAnswersArr.push(tmpVarObj);
                }
            });

            // console.log(tmpAnswersArr);
            CKEDITOR.instances.CKeditorArea.setData(body);
            // console.log(body);
        };

        vm.conditionForCreatingNewTemplate = function () {
            vm.activeTemplateId = undefined;
            activeTemplateTitle = undefined;
            CKEDITOR.instances.CKeditorArea.setData('');
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

                let body = CKEDITOR.instances.CKeditorArea.getData();
                tmpAnswersArr.forEach(function (item) {
                    body = body.split(item.inEditor).join(item.inServer);
                });

                vs.data = {
                    "title": "",
                    "body": "<!doctype html><html lang=\"en\"><head><meta charset=\"UTF-8\"><meta name=\"viewport\"content=\"width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0\"><meta http-equiv=\"X-UA-Compatible\" content=\"ie=edge\"><title>Document</title></head><body>" + body + "</body></html>",
                    "survey_id": activeSurveyID
                };

                vs.createTemplate = function () {
                    if (vs.templateForm.name.$invalid) {
                        toastr.error('Error invalid data');
                    }
                    else {
                        userService.createTemplate(tmpResearchId, vs.data).then(function (res) {
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
                    }
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

                let body = CKEDITOR.instances.CKeditorArea.getData();
                tmpAnswersArr.forEach(function (item) {
                    body = body.split(item.inEditor).join(item.inServer);
                });

                vs.data = {
                    title: activeTemplateTitle,
                    body: "<!doctype html><html lang=\"en\"><head><meta charset=\"UTF-8\"><meta name=\"viewport\"content=\"width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0\"><meta http-equiv=\"X-UA-Compatible\" content=\"ie=edge\"><title>Document</title></head><body>" + body + "</body></html>",
                    survey_id: activeSurveyID
                };
                // console.log(vs.data);

                vs.updateTemplate = function () {
                    if (vs.templateForm.name.$invalid) {
                        toastr.error('Error invalid data');
                    }
                    else {
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
                    }

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

                vs.confirm = function () {
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


        vm.pasteUserVariability = function (id, title, deleted) {
            // CKEDITOR.instances.CKeditorArea.insertText('{!!$userVariables[' + id + ']!!}');

            let userVarInEditorSide = '[[User var ' + id + ']]';
            let userVarInServerSide = '{!!$userVariables[' + id + ']!!}';
            let tmpVarObj = {
                inServer: userVarInServerSide,
                inEditor: userVarInEditorSide
            };

            CKEDITOR.instances.CKeditorArea.insertText('[[User var ' + id + ']] ');

            let coincidence = false;
            if (!tmpAnswersArr.length) {
                tmpAnswersArr.push(tmpVarObj);
            } else {
                tmpAnswersArr.forEach(function (item) {
                    if (item.inServer === userVarInServerSide) {
                        coincidence = true;
                    }
                });

                if (coincidence === false) {
                    tmpAnswersArr.push(tmpVarObj);
                }
            }
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
                    if (vs.varForm.name.$invalid) {
                        toastr.error('Error invalid data');
                    }
                    else {
                        console.log(vs.data);
                        userService.createVariability(vs.data).then(function (res) {
                            console.log(res);
                            if (res.success) {
                                userService.getVariability().then(function (res) {
                                    console.log(res.data, 'Variability list');
                                    vm.variability = res.data;
                                });
                            } else {
                                console.log('Create user variability error');
                            }
                        });
                        $mdDialog.cancel();
                    }
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
                    if (vs.varForm.name.$invalid) {
                        toastr.error('Error invalid data');
                    }
                    else {
                        console.log('saveVariability');
                        userService.editVariability(id, vs.data).then(function (res) {
                            console.log(res);
                            if (res.success) {
                                userService.getVariability().then(function (res) {
                                    console.log(res.data, 'Variability list');
                                    vm.variability = res.data;
                                });
                            } else {
                                console.log('Save user variability error');
                            }
                        });
                        $mdDialog.cancel();
                    }
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

                vs.confirm = function () {
                    userService.removeVariability(id).then(function (res) {
                        console.log(res);
                        if (res.success) {
                            userService.getVariability().then(function (res) {
                                console.log(res.data, 'Variability list');
                                vm.variability = res.data;
                                toastr.success('Remove success');
                            });
                        } else {
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
            console.log(CKEDITOR.instances['CKeditorArea'].getData(), 'Получить содержимое редактора');
            console.log(CKEDITOR.instances['CKeditorArea'].setData(), 'заменить содержимое редактора');
        }

        ///////////////////////////////////////////////////////////////////////////////


        //////////////////////////////Замена текста////////////////////////////////////
        vm.testReplace = function () {
            let tmpTextData = CKEDITOR.instances.CKeditorArea.getData();
            let id = 1;
            let tmp = "{!!\$contractAnswers\[" + id + "\]!!}";
            console.log(tmp);

            // CKEDITOR.instances.CKeditorArea.setData(tmpTextData.replace(new RegExp('12345', "g" ), "Replace success"));
            CKEDITOR.instances.CKeditorArea.setData(tmpTextData.replace(new RegExp(tmp, "g" ), "Replace success"));
            console.log(tmpTextData);
        };
        ///////////////////////////////////////////////////////////////////////////////
    }
})();