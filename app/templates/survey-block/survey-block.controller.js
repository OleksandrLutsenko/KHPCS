;(function () {
    'use strict';
    angular.module('app')
        .controller('SurveyBlockController', SurveyBlockController);

    SurveyBlockController.$inject = ['userService', '$state', 'survey', '$scope', '$mdDialog'];

    function SurveyBlockController(userService, $state, survey, $scope, $mdDialog) {
        let vm = this;

        vm.setActiveBlock = setActiveBlock;
        let idSurvey = survey.getActineSurvey();
        let idBlock = survey.getActiveBlock();

        vm.items = userService.getItems()[idSurvey.indexSurvey].blocks;

        function setActiveDot() {
            if (vm.items.length) {
                vm.activeBlockIndex = idBlock.indexBlock;
            }
        }

        setActiveDot();

        function setActiveBlock(id, indexBlock, blockName) {
            survey.setActiveBlock(id, indexBlock);
            $scope.$broadcast('parent', indexBlock);
            idBlock = survey.getActiveBlock();
            vm.activeBlockIndex = indexBlock;
            vm.blockName = blockName;
            console.log('Name: ' + blockName + ', ID: ' + id + ', Index: ' + indexBlock);
        }

        if (vm.items.length > 0) {
            console.log('item not undefine', vm.items);
            setActiveBlock(vm.items[0].id, 0, vm.items[0].name);
            $state.go('tab.survey-block.survey-question');
        }
        else {
            console.log('no data');
        }

        /////////////////////////////////Fix templates///////////////////////////
        function updateTemplate(data) {
            let block = data.data.block;
            let surveyId = idSurvey.id;
            let blockId = idBlock;
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
                    // }

                }else {
                    console.log('load templates error');
                }
            });
        }

        /////////////////////////////////showDotMenu/////////////////////////////

        vm.showDot = function (indexCurrentBlock) {
            if (indexCurrentBlock === vm.activeBlockIndex) {
                return true;
            }
            else {
                return false;
            }
        };

        //////////////////////////////AddBlock////////////////////////////////


        vm.addBlock = addBlock;
        function addBlock(id, cell) {

            $mdDialog.show({
                controller: 'AddBlockController',
                controllerAs: 'vm',
                templateUrl: 'components/survey-block/add-block/add-block.html',
                clickOutsideToClose: true,
                locals: {
                    data: {
                        idBlock: id,
                        cell: cell,
                    }
                }

            }).then(function (res) {
                if (res.type == 'update') {
                    console.log('backUpd');
                    vm.items = userService.getItems()[idSurvey.indexSurvey].blocks;
                }
                else {
                    console.log('backCreate');
                    vm.items = userService.getItems()[idSurvey.indexSurvey].blocks;
                    let indexBlock = vm.items.length - 1;
                    let id = vm.items[indexBlock].id;
                    let blockName = vm.items[indexBlock].name;
                    if (vm.items.length) {
                        $state.go('tab.survey-block.survey-question');
                    }

                    vm.setActiveBlock(id, indexBlock, blockName);
                }
            })
        }

        //////////////////////////////deleteBlock////////////////////////////////

        vm.deleteBlock = deleteBlock;

        function deleteBlock() {
            $mdDialog.show({
                controller: 'DeleteViewController',
                controllerAs: 'vm',
                templateUrl: 'components/deleteView/deleteView.html',
                clickOutsideToClose: true
            }).then(function () {
                userService.deleteBlock(idBlock.id).then(function (res) {
                    if (res.success) {
                        console.log('delete');

                        /////////////////////UpdateTemplate///////////////////
                        // if (vm.items[vm.activeBlockIndex].questions.length) {
                        //     updateTemplate(res);
                        // }
                        //////////////////////////////////////////////////////
                        userService.loadItems().then(function () {
                            vm.items = userService.getItems()[idSurvey.indexSurvey].blocks;
                            if (vm.items.length === 0) {
                                $state.go('tab.survey-block');
                            } else if (vm.items.length) {
                                let id;
                                let index;

                                if (idBlock.indexBlock === 0) {
                                    id = vm.items[idBlock.indexBlock].id;
                                    index = idBlock.indexBlock;
                                } else {
                                    id = vm.items[idBlock.indexBlock - 1].id;
                                    index = idBlock.indexBlock - 1;
                                    name = vm.items[idBlock.indexBlock -1].name;
                                }
                                vm.setActiveBlock(id, index);
                            }
                        })
                    }
                    else {
                        console.log('error')
                    }
                });
            })
        }


    }
})();