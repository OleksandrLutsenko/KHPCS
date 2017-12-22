;(function () {
    'use strict';
    angular.module('app')
        .controller('AddBlockController', AddBlockController);

    AddBlockController.$inject = ['userService', 'blockService', 'survey', '$mdDialog', 'data' , 'toastr'];

    function AddBlockController(userService, blockService, survey, $mdDialog, data , toastr) {
        let vm = this;

        let cell = data.cell;

        let idBlockSec = data.idBlock;

        vm.idBlockSec = idBlockSec;
        vm.items = data.items;
        let idSurvey = survey.getActineSurvey();
        let idBlock = survey.getActiveBlock();

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
                    blockService.updateBlock(idBlockSec, vm.data).then(function (res) {
                        if (res.success) {
                            let tmpObj = {
                                type: 'update'
                            };
                            $mdDialog.hide(tmpObj);
                        }
                        else {
                            console.log('errorUpd');
                            cancel();
                        }
                    });
                }
                else {

                    vm.data.order_number = vm.items.length;

                    blockService.createBlock(idSurvey.id, vm.data).then(function (res) {
                        if (res.success) {
                            let tmpObj = {
                                type: 'create'
                            };
                            $mdDialog.hide(tmpObj);
                        }
                        else {
                            cancel();
                        }
                    });
                }
            }
        }

    }
})();