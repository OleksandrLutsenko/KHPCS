;(function () {
    'use strict';
    angular
        .module('app')
        .controller('SurveyQuestionController', SurveyQuestionController);

    SurveyQuestionController.$inject = ['userService', 'survey', '$scope', '$mdDialog', 'questionService' , 'toastr'];

    function SurveyQuestionController(userService, survey, $scope, $mdDialog, questionService , toastr) {
        let vm = this;

        let idS = survey.getActineSurvey();
        let idB = survey.getActiveBlock();
        let indexSurvey = idS.indexSurvey;
        let indexBlock = idB.indexBlock;
        let idBlock = idB.id;

        let dropDown = [];

        vm.items = userService.getItems()[indexSurvey].blocks[indexBlock].questions;
        console.log(vm.items);

        dropDownFill();

        function dropDownFill() {
            dropDown = [];
            vm.items.forEach(function (item) {
                if(item.hidden == 1){
                    let tmpObj = {
                        title: item.title,
                        value: item.id
                    };
                    dropDown.push(tmpObj);
                }
            });
        }

        vm.showEdit = showEdit;
        vm.deleteQuest = deleteQuest;

        $scope.$on('parent', function (event, data) {
            indexBlock = data;
            vm.items = userService.getItems()[indexSurvey].blocks[indexBlock].questions;
            idB = survey.getActiveBlock();
            idBlock = idB.id;
        });

        function deleteQuest(id, index) {
            $mdDialog.show({
                controller: 'DeleteViewController',
                controllerAs: 'vm',
                templateUrl: 'components/deleteView/deleteView.html',
                clickOutsideToClose: true
            }).then(function () {
                questionService.deleteQuestion(id).then(function (res) {
                    console.log(res);
                    if (res.success) {
                        vm.items.splice(index, 1);
                        dropDownFill();
                        toastr.success('Question was deleted');

                        let surveyId = idS.id;
                        let templates;

                        userService.loadAllTemplates().then(function (res) {
                            if(res.success) {
                                // if (res.length) {
                                templates = res.data;

                                for (let i=0; i<templates.length; i++) {
                                    if (templates[i].survey_id === surveyId) {
                                        let templateId = templates[i].id;
                                        let data = templates[i];
                                        // console.log(data);

                                        let tmpVar = "{!!$contractAnswers["+ id +"]!!}";
                                        data.body = data.body.split(tmpVar).join('<span style="background-color: #ff0000">[undefined]</span>');
                                        userService.updateTemplate(templateId, data).then(function (res) {
                                            console.log(res);
                                            if (res.success) {
                                                console.log('Update template success');
                                            } else{
                                                console.log('Update template error');
                                            }
                                        });
                                    }
                                }
                                // }
                            }else {
                                console.log('load templates error');
                            }
                        });
                    }
                    else {
                        console.log('error');
                    }
                })
            })
        }

        function showEdit(id, index) {
            $mdDialog.show({
                controller: 'AddQuestionController',
                controllerAs: 'vm',
                locals: {
                    data: {
                        idQuestion: id,
                        idBlock: idBlock,
                        indexQuestion: index,
                        items: vm.items,
                        dropDown: dropDown
                    }
                },
                templateUrl: 'components/survey-question/addQuest/addQuest.html',
                clickOutsideToClose: true,
            }).then(function () {
                console.log('then');
                userService.loadItems().then(function () {
                    vm.items = userService.getItems()[indexSurvey].blocks[indexBlock].questions;
                    dropDownFill();
                })
            })
        }
    }
})();