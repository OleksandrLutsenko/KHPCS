;(function () {
    'use strict';
    angular.module('app')
        .controller('SurveyBlockController', SurveyBlockController);

    SurveyBlockController.$inject = ['blockService', '$state', 'survey', '$scope', '$mdDialog' , 'toastr', 'items', 'tabsService'];

    function SurveyBlockController(blockService, $state, survey, $scope, $mdDialog , toastr, items, tabsService) {
        let vm = this;
        tabsService.startTab();

        let activeSurvey = survey.getActineSurvey();
        let activeBlock = survey.getActiveBlock();

        let idSurvey = activeSurvey.id;

        vm.items = items;

        vm.addBlock = addBlock;
        vm.setActiveBlock = setActiveBlock;
        vm.deleteBlock = deleteBlock;

        function setActiveBlock(id, indexBlock, data) {
            survey.setActiveBlock(id, indexBlock);
            let tmpObj = {
                activeBlock: {
                    id: id,
                    indexBlock: indexBlock
                },
                data: data
            };
            $scope.$broadcast('setActiveBlock', tmpObj);
            $state.go('tab.survey-block.survey-question');
        }
        function mowUpdate(movData) {
            $scope.$broadcast('mowUpdate', movData);
        }

        if (vm.items.length > 0) {
            if(activeBlock.indexBlock == undefined){
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
                }
                mowUpdate(vm.items);
                console.log(vm.items);
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
                    // vm.items.push(res.data.block);
                    let indexBlock = vm.items.length;
                    let id = res.data.block.id;
                    setActiveBlock(id, indexBlock, res.data.block);
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