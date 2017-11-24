;(function () {
    'use strict';
    angular.module('app')
        .controller('SurveyBlockController', SurveyBlockController);

    SurveyBlockController.$inject = ['userService', '$state', 'survey', '$scope', '$mdDialog'];

    function SurveyBlockController(userService, $state, survey, $scope, $mdDialog) {
        let vm = this;
        console.log('controller started');
        vm.setActiveBlock = setActiveBlock;
        let idSurvey = survey.getActineSurvey();
        let idBlock = survey.getActiveBlock();


        vm.items = userService.getItems()[idSurvey.indexSurvey].blocks;

        function setActiveDot() {
            if(vm.items.length) {
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
            console.log('Name: ' + blockName + ', ID: ' + id + ', Index: ' +indexBlock);
        }

        if(vm.items.length > 0) {
            console.log('item not undefine', vm.items);
            setActiveBlock(vm.items[0].id, 0, vm.items[0].name);
            $state.go('tab.survey-block.survey-question');
        }
        else {
            console.log('no data');
        }

        /////////////////////////////////showDotMenu/////////////////////////////

        vm.showDot = function (indexCurrentBlock) {
            if (indexCurrentBlock === vm.activeBlockIndex){
                return true;
            }
            else {
                return false;
            }
        };

        //////////////////////////////AddBlock////////////////////////////////

        vm.addBlock = function (id, index) {

            $mdDialog.show({
                controller: addBlockController,
                controllerAs: 'vm',
                templateUrl: 'components/survey-block/add-block/add-block.html',
                clickOutsideToClose: true
            });

            function addBlockController($mdDialog) {
                let vs = this;

                if(typeof id != 'undefined') {
                    vs.data =  {
                        name: vm.items[index].name,
                    };
                }

                vs.saveBlock = function () {
                    userService.createBlock(idSurvey.id, vs.data).then(function (res) {
                        // console.log(idSurvey.id);
                        if (res.success) {
                            console.log(res);
                            userService.loadItems().then(function () {

                                // console.log(userService.getItems()[idSurvey.indexSurvey].blocks[userService.getItems()[idSurvey.indexSurvey].blocks.length - 1], 'log')
                                // vm.items.push(userService.getItems()[idSurvey.indexSurvey].blocks[userService.getItems()[idSurvey.indexSurvey].blocks.length - 1]);

                                vm.items = userService.getItems()[idSurvey.indexSurvey].blocks;

                                console.log(vm.items);

                                let indexBlock = vm.items.length-1;
                                let id = vm.items[indexBlock].id;
                                let blockName = vm.items[indexBlock].name;

                                console.log('Передаем ID: ' + id);
                                console.log('Передаем Index: ' + indexBlock);

                                vm.setActiveBlock(id, indexBlock, blockName);

                                if (vm.items.length) {
                                    $state.go('tab.survey-block.survey-question');
                                }

                                $mdDialog.cancel();

                            });
                        }
                        else {
                            console.log('error');
                        }
                        vs.newBlockClose();
                    });
                };

                vs.newBlockClose = function () {
                    $mdDialog.cancel();
                };
            }
        };

        //////////////////////////////editBlock////////////////////////////////

        vm.editBlock = function () {
            $mdDialog.show({
                controller: editBlockController,
                controllerAs: 'vm',
                templateUrl: 'components/survey-block/edit-block/edit-block.html',
                clickOutsideToClose: true
            });

            function editBlockController($mdDialog) {
                let vs = this;

                vs.data =  {
                    name: vm.blockName,
                };

                    vs.saveBlock = function () {
                        userService.updateBlock(idBlock.id, vs.data).then(function (res) {
                            if (res.success) {
                                userService.loadItems().then(function () {
                                    vm.items = userService.getItems()[idSurvey.indexSurvey].blocks;
                                    // console.log(vm.items);
                                    $mdDialog.cancel();
                                });
                            }
                            else {
                                console.log('error');
                            }
                            vs.cancel();
                        });
                };

                vs.cancel = function () {
                    $mdDialog.cancel();
                };
            }
        };

        //////////////////////////////deleteBlock////////////////////////////////

        vm.deleteBlock = function () {
            $mdDialog.show({
                controller: deleteBlockController,
                controllerAs: 'vm',
                templateUrl: 'components/survey-block/delete-block/delete-block.html',
                clickOutsideToClose: true
            });

            function deleteBlockController($mdDialog) {
                let vs = this;

                vs.deleteBlockYes = function () {
                    console.log('Удален блок с ID: ' + idBlock.id);
                    userService.deleteBlock(idBlock.id).then(function (res) {
                        if (res.success) {
                            console.log(res);
                            userService.loadItems().then(function () {
                                $mdDialog.cancel();
                                vm.items = userService.getItems()[idSurvey.indexSurvey].blocks;
                                console.log(vm.items);

                                if (vm.items.length === 0) {
                                    $state.go('tab.survey-block');
                                } else if (vm.items.length){
                                    let id;
                                     let index;
                                     
                                     if (idBlock.indexBlock === 0) {
                                        id = vm.items[idBlock.indexBlock].id;
                                        index = idBlock.indexBlock;
                                     } else {
                                        id = vm.items[idBlock.indexBlock-1].id;
                                        index = idBlock.indexBlock-1;
                                     }
                                    vm.setActiveBlock(id, index);
                                }


                            });
                        }
                        else {
                            console.log('errorDelete');
                        }
                    });
                    $mdDialog.cancel();
                };

                vs.deleteBlockCancel = function () {
                    $mdDialog.cancel();
                };
            }
        };
    }
})();