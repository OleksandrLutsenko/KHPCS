;(function () {
    'use strict';
    angular.module('app')
        .controller('SurveyBlockController', SurveyBlockController);

    SurveyBlockController.$inject = ['userService', '$state', 'survey', '$scope', '$mdDialog' , 'toastr'];

    function SurveyBlockController(userService, $state, survey, $scope, $mdDialog , toastr) {
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
                    vm.items = userService.getItems()[idSurvey.indexSurvey].blocks;
                    toastr.success('Block was edited');
                }
                else {
                    toastr.success('New block was created');
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
                        toastr.success('Block was deleted');
                    }
                    else {
                        console.log('error')
                    }
                });
            })
        }


    }
})();