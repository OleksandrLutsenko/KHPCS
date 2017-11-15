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
        // vm.activeBlockId;
        // vm.blockName;

        function setActiveBlock(id, indexBlock, blockName) {
            survey.setActiveBlock(id, indexBlock);
            $scope.$broadcast('parent', indexBlock);
            idBlock = survey.getActiveBlock();
            vm.activeBlockId = id;
            vm.blockName = blockName;
            console.log(blockName);
        }

        if(vm.items.length > 0) {
            console.log('item not undefine', vm.items);
            survey.setActiveBlock(vm.items[0].id, 0);
            $state.go('tab.survey-block.survey-question');
        }
        else {
            console.log('no data');
        }

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

                vs.saveBlock = function (id ) {
                    userService.createBlock(idSurvey.id, vs.data).then(function (res) {
                        console.log(id);
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

                vs.newBlockClose = function () {
                    $mdDialog.cancel();
                };
            }
        };

        /////////////////////////////////showDotMenu/////////////////////////////

        vm.showDot = function (nameCurrentTab) {
            if (nameCurrentTab === vm.activeBlockId){
                return true;
            }
            else {
                return false;
            }
        };

        //////////////////////////////editBlock////////////////////////////////

        vm.editBlock = function (id, index) {
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
                                    console.log(vm.items);
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

        vm.deleteBlockTest = function () {
            $mdDialog.show({
                controller: deleteBlockController,
                controllerAs: 'vm',
                templateUrl: 'components/survey-block/delete-block/delete-block.html',
                clickOutsideToClose: true
            });

            function deleteBlockController($mdDialog) {
                let vs = this;

                vs.deleteBlockYes = function () {
                    console.log('test vm.deleteYes');
                    console.log(idBlock);
                        userService.deleteBlock(idBlock.id).then(function (res) {
                            console.log(res);
                            if (res.success) {
                                console.log(res);
                                userService.loadItems().then(function () {
                                    vm.items = userService.getItems()[idSurvey.indexSurvey].blocks;
                                    $mdDialog.cancel();
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