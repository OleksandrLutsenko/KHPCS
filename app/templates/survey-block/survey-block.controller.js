;(function () {
    'use strict';
    angular.module('app')
        .controller('SurveyBlockController', SurveyBlockController);

    SurveyBlockController.$inject = ['userService', '$state', 'survey', '$scope', '$mdDialog'];

    function SurveyBlockController(userService, $state, survey, $scope, $mdDialog) {
        let vm = this;
        vm.setActiveBlock = setActiveBlock;
        let id = survey.getActineSurvey();

        vm.items = userService.getItems()[id.indexSurvey].blocks;
        // vm.activeBlockId;
        // vm.blockName;

        function setActiveBlock(id, indexBlock, blockName) {
            survey.setActiveBlock(id, indexBlock);
            $scope.$broadcast('parent', indexBlock);
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

        vm.addBlock = function () {
            $mdDialog.show({
                controller: addBlockController,
                controllerAs: 'vm',
                templateUrl: 'components/survey-block/add-block/add-block.html',
                clickOutsideToClose: true
            });

            function addBlockController($mdDialog) {
                let vs = this;

                vs.newBlockSave = function () {
                    alert('Здесь должна быть функция :/ Survey-block.controller.js  str=45');
                    $mdDialog.cancel();
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

        vm.editBlock = function () {
            $mdDialog.show({
                controller: editBlockController,
                controllerAs: 'vm',
                templateUrl: 'components/survey-block/edit-block/edit-block.html',
                clickOutsideToClose: true
            });

            function editBlockController($mdDialog) {
                let vs = this;

                vs.save = function () {
                    alert('Здесь должна быть функция :/ Survey-block.controller.js  str=80');
                    $mdDialog.cancel();
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

                vs.deleteYes = function () {
                    alert('Здесь должна быть функция :/ Survey-block.controller.js  str=104');
                    $mdDialog.cancel();
                };

                vs.deleteCancel = function () {
                    $mdDialog.cancel();
                };
            }
        };

    }
})();