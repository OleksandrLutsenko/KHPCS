;(function () {
    'use strict';
    angular.module('app')
        .controller('SurveyBlockController', SurveyBlockController);

    SurveyBlockController.$inject = ['blockService', '$state', 'survey', '$scope', '$mdDialog' , 'toastr', 'items', 'tabsService', '$timeout', '$mdSidenav', '$mdUtil', '$log'];

    function SurveyBlockController(blockService, $state, survey, $scope, $mdDialog , toastr, items, tabsService, $timeout, $mdSidenav, $mdUtil, $log) {
        let vm = this;
        tabsService.startTab();

        let activeSurvey = survey.getActiveSurvey();
        vm.activeBlock = survey.getActiveBlock().indexBlock;

        let idSurvey = activeSurvey.id;

        vm.items = items;

        vm.addBlock = addBlock;
        vm.setActiveBlock = setActiveBlock;
        vm.deleteBlock = deleteBlock;

        function setActiveBlock(id, indexBlock) {
            vm.activeBlock = indexBlock;
            survey.setActiveBlock(id, indexBlock);
            let tmpObj = {
                activeBlock: {
                    id: id,
                    indexBlock: indexBlock
                }
            };
            $scope.$broadcast('setActiveBlock', tmpObj);
            $state.go('tab.survey-block.survey-question');
        }

        $scope.$on('showBlock', function (event, data) {
            buildToggler();
        });

        function buildToggler() {
            $mdSidenav('left').toggle();
        }

        if (vm.items.length > 0) {
            if(vm.activeBlock == undefined){
                setActiveBlock(vm.items[0].id, 0);
            }
            $state.go('tab.survey-block.survey-question');
        }
        else {
            console.log('no data');
        }

        vm.sortableOptionsBlock = {
            connectWith: ".block-container",
            "ui-floating": true,

            stop: function (event, ui) {
                let droptargetModel = ui.item.sortable.droptargetModel;
                let model = ui.item.sortable.model;

                if(droptargetModel == vm.items) {
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
                    for(let i = 0; i < droptargetModel.length; i++){
                        if(model.id == droptargetModel[i].id){
                            setActiveBlock(model.id, i);
                            break;
                        }
                    }
                }
            }
        };

        function addBlock(item, index) {

            let orderNumber = 0;
            vm.items.forEach(function (item) {
                if(item.order_number > orderNumber) {
                    orderNumber = item.order_number;
                }
            });

            $mdDialog.show({
                controller: 'AddBlockController',
                controllerAs: 'vm',
                templateUrl: 'components/survey-block/add-block/add-block.html',
                clickOutsideToClose: true,
                locals: {
                    data: {
                        item: item,
                        idSurvey: idSurvey,
                        order_number: orderNumber + 1
                    }
                }
            }).then(function (res) {
                console.log(res);
                if (res.type) {
                    vm.items.splice(index, 1, res.data.block);
                    toastr.success('Block was edited');
                }
                else {
                    items.push(res.data.block);
                    vm.items = items;
                    let indexBlock = vm.items.length - 1;
                    let id = res.data.block.id;
                    setActiveBlock(id, indexBlock);
                    toastr.success('New block was created');
                }
                console.log(vm.items);
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
                        vm.items.splice(index, 1);

                        let indexBlock = survey.getActiveBlock().indexBlock;
                        if(indexBlock == index) {
                            let id = vm.items[0].id;
                            setActiveBlock(id, 0)
                        }
                        toastr.success('Block was deleted');
                    }
                });
            });
        }
    }
})();