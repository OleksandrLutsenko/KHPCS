;(function () {
    'use strict';
    angular.module('app')
        .controller('SurveyBlockController', SurveyBlockController);

    SurveyBlockController.$inject = ['userService', 'blockService', 'surveyService', '$state', 'survey', '$scope', '$mdDialog' , 'toastr', 'items'];

    function SurveyBlockController(userService, blockService, surveyService, $state, survey, $scope, $mdDialog , toastr, items) {
        let vm = this;

        let activeSurvey = survey.getActineSurvey();

        let idSurvey = activeSurvey.id;
        let indexSurvey = activeSurvey.indexSurvey;

        vm.items = items;

        vm.addBlock = addBlock;
        vm.setActiveBlock = setActiveBlock;
        vm.deleteBlock = deleteBlock;

        function loadOneSurvey() {
            surveyService.loadOneSurvey(idSurvey).then(function (res) {
                if(res.success){
                    vm.items = res.data.survey.blocks;
                }
            });
        }

        function setActiveBlock(id, indexBlock) {
            survey.setActiveBlock(id, indexBlock);
            $scope.$broadcast('parent', indexBlock);
        }

        if (vm.items.length > 0) {
            setActiveBlock(vm.items[0].id, 0);
            $state.go('tab.survey-block.survey-question');
        }
        else {
            console.log('no data');
        }

        vm.sortableOptionsBlock = {
            connectWith: ".block-container",
            "ui-floating": true,

            stop: function (event, ui) {
                vm.items.forEach(function (item, index) {
                   let tmpObj = {
                       order_number: index,
                       name: item.name
                   };

                    blockService.updateBlock(item.id, tmpObj).then(function (res) {
                        if (!res.success) {
                            toastr.error('error');
                        }
                    });
                });
            }

        };

        /////////////////////////////////Fix templates///////////////////////////
        function updateTemplate(data) {
            let block = data.data.block;
            let surveyId = idSurvey.id;
            let templates;


            userService.loadAllTemplates().then(function (res) {
                if(res.success) {
                    templates = res.data;

                    for (let i=0; i<templates.length; i++) {
                        if (templates[i].survey_id === surveyId) {
                            let templateId = templates[i].id;
                            let data = templates[i];
                            // console.log(data);

                            if (block.questions.length) {
                                for (let x=0; x<block.questions.length; x++) {
                                    let tmpVar = "{!!$contractAnswers["+block.questions[x].id+"]!!}";
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
                                console.log(block.questions, 'Qustions');
                            } else {
                                console.log('No questions');
                            }
                            console.log(block, 'Removed block');
                        }
                    }

                }else {
                    console.log('load templates error');
                }
            });
        }


        function addBlock(item) {

            $mdDialog.show({
                controller: 'AddBlockController',
                controllerAs: 'vm',
                templateUrl: 'components/survey-block/add-block/add-block.html',
                clickOutsideToClose: true,
                locals: {
                    data: {
                        item: item,
                        idSurvey: idSurvey,
                        length: items.length
                    }
                }
            }).then(function (res) {
                loadOneSurvey();
                if (res) {
                    let indexBlock = vm.items.length - 1;
                    let id = vm.items[indexBlock].id;

                    vm.setActiveBlock(id, indexBlock);
                    toastr.success('Block was edited');
                }
                else {
                    toastr.success('New block was created');
                }
            })
        }

        function deleteBlock(id, index) {
            $mdDialog.show({
                controller: 'DeleteViewController',
                controllerAs: 'vm',
                templateUrl: 'components/deleteView/deleteView.html',
                clickOutsideToClose: true
            }).then(function () {
                blockService.deleteBlock(id).then(function (res) {
                    if (res.success) {
                        loadOneSurvey();

                        /////////////////////UpdateTemplate///////////////////
                        if (vm.items[index].questions.length) {
                            updateTemplate(res);
                        }

                        toastr.success('Block was deleted');
                    }
                });
            })
        }


    }
})();