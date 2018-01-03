;(function () {
    'use strict';

    angular.module('app')
        .controller('ContractEditorController', ContractEditorController);



    ContractEditorController.$inject = ['userService', '$mdDialog', 'toastr', 'contractService', 'tabsService', 'surveyService', '$scope'];

    function ContractEditorController(userService, $mdDialog, toastr, contractService, tabsService, surveyService, $scope) {
        let vm = this;
        tabsService.startTab('page3');
        console.log('contract-editor controller start');

        let activeSurveyID;
        let activeSurveyName;
        let activeBlockId;
        let activeTemplateTitle;
        let tmpResearchId;
        let tmpAnswersArr = [];
        let tmpImagesArr = [];
        let pasteImgBeforeCreateTemplate = false;
        vm.activeTemplateId = undefined;
        vm.showTemplateTab = true;
        vm.showSurveyVarTab = false;
        vm.showUserVarTab = false;

        vm.surveys = [];
        userService.loadSurveysOnly().then(function (res) {
            if (res.success) {
                console.log(res.data.onlySurvey);
                vm.surveys = res.data.onlySurvey;
                if (vm.surveys.length) {

                    for (let i=0; i<vm.surveys.length; i++) {
                        if (vm.surveys[i].survey_status === 'active' || vm.surveys[i].survey_status === 'inactive') {
                            activeSurveyID = vm.surveys[i].survey_id;
                            activeSurveyName = vm.surveys[i].survey_name;
                            break;
                        }
                    }

                    surveyService.loadOneSurvey(activeSurveyID).then(function (survey) {
                        if (survey.success) {
                            vm.activeSurvey = survey.data.survey.blocks;
                            console.log(vm.activeSurvey, 'vm.activeSurvey');
                        }else{
                            console.log('load survey error');
                        }
                    });

                    CKEDITOR.instances.CKeditorArea.setData('');

                    // contractService.createNewResearch().then(function (res) {
                    //     tmpResearchId = res.data.id;
                    // console.log(tmpResearchId);
                    // });
                }
            }else {
                console.log('load surveys error');
            }
        });

        contractService.getVariabilityWithDeleted().then(function (res) {
            if(res.success) {
                vm.variability = res.data;
                console.log(vm.variability, 'vm.variability');
            }else {
                console.log('load variability error');
            }
        });


        // contractService.loadAllTemplates().then(function (res) {
        contractService.loadTemplateList().then(function (res) {
            if(res.success) {
                vm.templates = res.data.contractsWithoutBody;
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


        CKEDITOR.replace('CKeditorArea');

        CKEDITOR.addCss('body{width: 21cm;min-height: 29.7cm;border: 1px #D3D3D3 solid;box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);padding: 2cm; box-sizing: border-box; margin: 0 auto; font-family: -webkit-pictograph; font-size: 15px !important;line-height: 1.2 !important}');
        CKEDITOR.addCss('body p{margin: 5px 0;}');
        CKEDITOR.addCss('span[lang]{font-style: normal !important;}');

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
        vm.setActiveSurvey = function setActiveSurvey(id, name) {
            activeSurveyID = id;
            activeSurveyName = name;
            pasteImgBeforeCreateTemplate = false;
            tmpResearchId = undefined;

            surveyService.loadOneSurvey(activeSurveyID).then(function (survey) {
                if (survey.success) {
                    vm.activeSurvey = survey.data.survey.blocks;
                    console.log(vm.activeSurvey, 'vm.activeSurvey');
                }else{
                    console.log('load survey error');
                }
            });

            vm.activeTemplateId = undefined;
            activeTemplateTitle = undefined;
            CKEDITOR.instances.CKeditorArea.setData('');
        };

        vm.pasteTitle = function (data) {
            CKEDITOR.instances.CKeditorArea.insertText(data);
        };

        vm.pasteVariability = function (title, id) {
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
            let deletedQuestionInSurvey;
            vm.activeTemplateId = data.id;
            activeTemplateTitle = data.title;
            tmpAnswersArr = [];
            tmpImagesArr = [];
            pasteImgBeforeCreateTemplate = false;

            contractService.loadOneTemplate(vm.activeTemplateId).then(function (template) {
                if (template.success) {
                    let body = template.data.contract.body.replace("<!doctype html><html lang=\"en\"><head><meta charset=\"UTF-8\"><meta name=\"viewport\"content=\"width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0\"><meta http-equiv=\"X-UA-Compatible\" content=\"ie=edge\"><title>Document</title></head><body>", "").replace("</body></html>", "");
                    tmpResearchId = template.data.contract.contract_research_id;
                    console.log('Research = ' + tmpResearchId);

                    surveyService.loadDeletedQuestionsInSurvey(activeSurveyID).then(function (questions) {
                        if (questions.success) {
                            deletedQuestionInSurvey = questions.data.deletedQuestions;

                            vm.activeSurvey.forEach(function (block) {
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
                                    question.answers.forEach(function (answer) {
                                        answer.child_questions.forEach(function (childQuestion) {
                                            let surveyVarInServerSide = '{!!$contractAnswers[' + childQuestion.id + ']!!}';
                                            if (body.indexOf(surveyVarInServerSide) !== -1) {
                                                let surveyVarInEditorSide = '[[Answer ' + childQuestion.id + ']]';
                                                let tmpVarObj = {
                                                    inServer: surveyVarInServerSide,
                                                    inEditor: surveyVarInEditorSide
                                                };
                                                tmpAnswersArr.push(tmpVarObj);
                                                body = body.split(surveyVarInServerSide).join(surveyVarInEditorSide);
                                            }
                                        });
                                    });
                                });
                            });

                            deletedQuestionInSurvey.forEach(function (questionID) {
                                let surveyVarInServerSide = '{!!$contractAnswers[' + questionID + ']!!}';
                                if (body.indexOf(surveyVarInServerSide) !== -1) {
                                    let surveyVarInEditorSide = '<span style="background-color: red">Answer ' + questionID + ' was deleted</span>';
                                    let tmpVarObj = {
                                        inServer: surveyVarInServerSide,
                                        inEditor: surveyVarInEditorSide
                                    };
                                    tmpAnswersArr.push(tmpVarObj);
                                    body = body.split(surveyVarInServerSide).join(surveyVarInEditorSide);
                                }
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

                            (function () {
                                let staticVarArr = [{serverSide: '{!! $user["name"] !!}', editorSide: '[[user name]]'},
                                    {serverSide: '{!! $user["email"] !!}', editorSide: '[[user email]]'},
                                    {serverSide: '{!! $customer["name"] !!}', editorSide: '[[customer name]]'},
                                    {serverSide: '{!! $customer["surname"] !!}', editorSide: '[[customer surname]]'},
                                    {serverSide: '{!! $customer["classification"] !!}', editorSide: '[[customer classification]]'},
                                ];

                                let userVarInEditorSide;
                                let userVarInServerSide;

                                staticVarArr.forEach(function (staticVar) {
                                    if (body.indexOf(staticVar.serverSide) !== -1) {
                                        userVarInEditorSide = staticVar.editorSide;
                                        userVarInServerSide = staticVar.serverSide;
                                    }
                                    let tmpVarObj = {
                                        inServer: userVarInServerSide,
                                        inEditor: userVarInEditorSide
                                    };
                                    body = body.split(userVarInServerSide).join(userVarInEditorSide);
                                    tmpAnswersArr.push(tmpVarObj);
                                });
                            }());

                            (function () {
                                contractService.imageListInResearch(vm.activeTemplateId).then(function (res) {
                                    let imageList = res.imageList;
                                    console.log(imageList);
                                    imageList.forEach(function (cell) {
                                        if (body.indexOf(cell.link) === -1) {
                                            console.log('Image ' + cell.id + ' is not used and will be deleted');
                                            contractService.deleteImage(cell.id).then(function (res) {
                                                console.log(res.image);
                                            });
                                        }
                                    });
                                });
                            }());
                            // console.log(tmpAnswersArr);
                            CKEDITOR.instances.CKeditorArea.setData(body);
                            // console.log(body);

                        }else{
                            console.log('load RemovedQuestionsList error');
                        }
                    });
                }else{
                    console.log('load Template error');
                }
            });
        };

        vm.createTemplate = function () {
            // vm.activeTemplateId = undefined;
            // activeTemplateTitle = undefined;
            // CKEDITOR.instances.CKeditorArea.setData('');
            // console.log(vm.templates);
            // console.log(activeSurveyID);





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
                        if (pasteImgBeforeCreateTemplate === true) {
                            createTemplate(body, tmpImagesArr);
                            console.log('pasteImgBeforeCreateTemplate = false');
                            // pasteImgBeforeCreateTemplate = false;
                            console.log("Research undefined");
                        } else {
                            contractService.createNewResearch().then(function (res) {
                                tmpResearchId = res.data.id;
                                console.log('Create research (' + tmpResearchId + ')');

                                createTemplate(body, tmpImagesArr);
                            });
                        }

                        // console.log(vs.data);
                        $mdDialog.cancel();
                    }

                    function createTemplate() {
                        console.log(body);
                        contractService.createTemplate(tmpResearchId, vs.data).then(function (res) {
                            console.log(res);
                            if (res.success) {
                                contractService.loadTemplateList().then(function (res) {
                                    vm.templates = res.data.contractsWithoutBody;
                                    vm.activeTemplateId = vm.templates[vm.templates.length - 1].id;
                                    activeTemplateTitle = vm.templates[vm.templates.length - 1].title;
                                    // CKEDITOR.instances.CKeditorArea.setData("");
                                });
                                if (pasteImgBeforeCreateTemplate === true) {
                                    tmpImagesArr.forEach(function (cell) {
                                        console.log(cell.link);
                                        if (body.indexOf(cell.link) === -1) {
                                            console.log('Image ' + cell.id + ' is not used and will be deleted');
                                            contractService.deleteImage(cell.id);
                                        }
                                        pasteImgBeforeCreateTemplate = false;
                                        tmpImagesArr = [];
                                    });

                                }
                                // tmpImagesArr = [];
                            }
                        });
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
                        contractService.updateTemplate(vm.activeTemplateId, vs.data).then(function (res) {
                            console.log(res);
                            if (res.success) {
                                activeTemplateTitle = res.data.contract.title;
                                contractService.loadTemplateList().then(function (res) {
                                    vm.templates = res.data.contractsWithoutBody;
                                    // console.log(vm.templates, 'Template list');
                                });
                                tmpImagesArr.forEach(function (cell) {
                                    // console.log(cell.link);
                                    if (body.indexOf(cell.link) === -1) {
                                        console.log('Image ' + cell.id + ' is not used and will be deleted');
                                        contractService.deleteImage(cell.id);
                                    }
                                    tmpImagesArr = [];
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
                    contractService.removeTemplate(vm.activeTemplateId).then(function (res) {
                        console.log(res);
                        if (res.success) {
                            contractService.loadTemplateList().then(function (res) {
                                vm.templates = res.data.contractsWithoutBody;
                                CKEDITOR.instances.CKeditorArea.setData("");
                                vm.activeTemplateId = undefined;
                                activeTemplateTitle = undefined;
                            });
                            tmpResearchId = undefined;
                            pasteImgBeforeCreateTemplate = false;
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

        vm.pasteStaticVariability = function (data) {
            let userVarInEditorSide;
            let userVarInServerSide;

            if (data === 'User name') {
                userVarInEditorSide = '[[user name]]';
                userVarInServerSide = '{!! $user["name"] !!}';
            } else if (data === 'User email') {
                userVarInEditorSide = '[[user email]]';
                userVarInServerSide = '{!! $user["email"] !!}';
            } else if (data === 'Customer name') {
                userVarInEditorSide = '[[customer name]]';
                userVarInServerSide = '{!! $customer["name"] !!}';
            } else if (data === 'Customer surname') {
                userVarInEditorSide = '[[customer surname]]';
                userVarInServerSide = '{!! $customer["surname"] !!}';
            } else if (data === 'Customer classification') {
                userVarInEditorSide = '[[customer classification]]';
                userVarInServerSide = '{!! $customer["classification"] !!}';
            }

            let tmpVarObj = {
                inServer: userVarInServerSide,
                inEditor: userVarInEditorSide
            };

            CKEDITOR.instances.CKeditorArea.insertText(userVarInEditorSide + ' ');

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

        vm.pasteUserVariability = function (id) {
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
                        contractService.createVariability(vs.data).then(function (res) {
                            console.log(res);
                            if (res.success) {
                                contractService.getVariabilityWithDeleted().then(function (res) {
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

                vs.updateVariability = function () {
                    if (vs.varForm.name.$invalid) {
                        toastr.error('Error invalid data');
                    }
                    else {
                        console.log('saveVariability');
                        contractService.editVariability(id, vs.data).then(function (res) {
                            console.log(res);
                            if (res.success) {
                                contractService.getVariabilityWithDeleted().then(function (res) {
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
                    contractService.removeVariability(id).then(function (res) {
                        console.log(res);
                        if (res.success) {
                            contractService.getVariabilityWithDeleted().then(function (res) {
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

        ////////////////////////////////Image//////////////////////////////////////////

        vm.sendImage = function () {
            if (tmpResearchId === undefined) {
                contractService.createNewResearch().then(function (res) {
                    tmpResearchId = res.data.id;
                    pasteImgBeforeCreateTemplate = true;
                    console.log('pasteImgBeforeCreateTemplate = true;');
                    console.log('Research = ' + tmpResearchId);

                    sendImg();
                });
            } else {
                sendImg();
            }

            function sendImg() {
                let image = document.getElementById('file');
                let fd = new FormData();
                fd.append('image_file', image.files[0]);
                let xhttp = new XMLHttpRequest();

                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        // console.log('done');
                        let data = JSON.parse(this.response);
                        // console.log(data);
                        CKEDITOR.instances.CKeditorArea.insertHtml('<img src="' + data.image.link + '" alt="Image" style="max-width: 300px">&nbsp');

                        let tmpImgObj = {
                            id: data.image.id,
                            link: data.image.link
                        };
                        tmpImagesArr.push(tmpImgObj);
                        console.log(tmpImagesArr);
                    }
                };

                xhttp.open("POST", contractService.uploadImage(tmpResearchId), fd, true);
                xhttp.setRequestHeader("token", userService.getToken());
                xhttp.send(fd);
            };
        }

        let image = document.getElementById('file');

        vm.fileName = 'Choose File';
        image.addEventListener("change" , function() {
            if (image.files.length) {
                $scope.$apply(
                    function () {
                        vm.fileName = image.files[0].name;
                        console.log(image.files[0].type);
                        if (image.files[0].type.indexOf('image') !== -1) {
                            vm.showUpload = true;
                            console.log('Картинка!!!');
                        } else {
                            vm.showUpload = false;
                            vm.fileName = 'Choose File';
                            toastr.error('Select an image file');
                        }
                    });
            } else {
                $scope.$apply(
                    function () {
                    vm.fileName = 'Choose File';
                    vm.showUpload = false;
                });
            }
        });



    }
})();