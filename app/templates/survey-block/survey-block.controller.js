;(function () {
    'use strict';
    angular.module('app')
        .controller('SurveyBlockController', SurveyBlockController);

    SurveyBlockController.$inject = ['userService', '$state', 'survey', '$scope', '$mdDialog'];

    function SurveyBlockController(userService, $state, survey, $scope, $mdDialog) {
        let vm = this;
        vm.setActiveBlock = setActiveBlock;
        let idSurvey = survey.getActineSurvey();

        vm.items = userService.getItems()[idSurvey.indexSurvey].blocks;
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
                        name: vm.items[index].blockName,
                    }
                }

                vs.saveBlock = function (id , index) {
                    console.log(id, vs.data);
                    console.log(id);

                    if(typeof id != 'undefined') {
                        userService.updateBlock(id, vs.data).then(function (res) {
                            if (res.success) {
                                console.log(res, 'succes');
                                vm.items.splice(index, 1, res.data);
                            }
                            else {
                                console.log('error');
                            }
                            vs.cancel();
                        });
                    }
                    else {
                        console.log('fuck');
                        userService.createBlock(idSurvey.id, vs.data).then(function (res) {
                            console.log(id);
                            if (res.success) {
                                console.log(res, 'crea');
                                vm.items.push(res.data);
                            }
                            else {
                                console.log('error');
                            }
                            vs.cancel();
                        });
                    }
                };

                vs.cancel = function () {
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

                vs.saveBlock = function () {
                    console.log(id, vs.data);
                    console.log(id);

                    if(typeof id != 'undefined') {
                        userService.updateBlock(id, vs.data).then(function (res) {
                            if (res.success) {
                                userService.loadItems().then(function () {
                                    vm.items = userService.getItems()[idSurvey.indexSurvey].blocks;
                                });
                            }
                            else {
                                console.log('error');
                            }
                            vs.cancel();
                        });
                    }
                    else {
                        console.log('fuck');
                        userService.createBlock(idSurvey.id, vs.data).then(function (res) {
                            console.log(id);
                            if (res.success) {
                                console.log(res, 'crea');
                                vm.items.push(res.data);
                            }
                            else {
                                console.log('error');
                            }
                            vs.cancel();
                        });
                    }
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
                let vm = this;

                vm.deleteYes = function () {
                    if (typeof id != 'undefined') {
                        userService.deleteBlock(id).then(function (res) {
                            if (res.success) {
                                vm.items.splice(index, 1);
                                vm.cancel();
                            }
                            else {
                                console.log('errorDelete');
                            }
                        });
                    }
                    else {
                        console.log('deleteError');
                    }
                    $mdDialog.cancel();
                };

                vs.deleteCancel = function () {
                    $mdDialog.cancel();
                };
            }
        };
    }
})();