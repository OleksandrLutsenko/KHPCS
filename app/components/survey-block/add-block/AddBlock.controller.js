;(function () {
    'use strict';
    angular.module('app')
        .controller('AddBlockController', AddBlockController);

    AddBlockController.$inject = ['userService', 'survey', '$mdDialog', 'data' , 'toastr'];

    function AddBlockController(userService, survey, $mdDialog, data , toastr) {
        let vm = this;

        let cell = data.cell;

        let idBlockSec = data.idBlock;
        vm.idBlockSec = idBlockSec;

        let idSurvey = survey.getActineSurvey();
        let idBlock = survey.getActiveBlock();

        vm.items = userService.getItems()[idSurvey.indexSurvey].blocks;

        vm.cancel = cancel;

        function cancel() {
            $mdDialog.cancel()
        }

        //////////////////////////////AddBlock////////////////////////////////

        if (typeof idBlockSec != 'undefined') {
            vm.data = {
                name: cell
            };
        }

        vm.saveBlock = saveBlock;
        function saveBlock() {

            if (vm.blockForm.$invalid) {
                console.log('error');
                toastr.error('Please try again', 'Form is invalid');
            }
            else {

                if (typeof idBlockSec != 'undefined') {
                    userService.updateBlock(idBlock.id, vm.data).then(function (res) {
                        userService.loadItems().then(function () {
                            if (res.success) {
                                let tmpObj = {
                                    type: 'update'
                                };
                                $mdDialog.hide(tmpObj);
                            }
                            else {
                                console.log('errorUpd');
                            }

                            $mdDialog.cancel();

                        });
                    });
                }
                else {

                    vm.data.order_number = vm.items.length;

                    userService.createBlock(idSurvey.id, vm.data).then(function (res) {
                        console.log('create');
                        userService.loadItems().then(function () {
                            if (res.success) {
                                let tmpObj = {
                                    type: 'create'
                                };
                                $mdDialog.hide(tmpObj);
                            }
                            else {
                                cancel();
                            }

                            $mdDialog.cancel();

                        });
                    });
                }
            }
        }

    }
})();