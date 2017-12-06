;(function () {
    'use strict';

    angular.module('app')
        .controller('CreateSurveyController', CreateSurveyController);


    CreateSurveyController.$inject = ['userService', '$mdDialog', 'data'];

    function CreateSurveyController(userService, $mdDialog, data) {

        let vm = this;

        let id = data.id;

        vm.id = id;

        vm.items = userService.getItems();

        vm.cancel = cancel;

        function cancel() {
            $mdDialog.cancel()
        }

        vm.data = {
            name: '',
            status: '2'
        };


        if (typeof id != 'undefined') {
            let it = data.it.name;
            vm.data = {
                name: it
            };
        }

        vm.saveSurvey = saveSurvey;
        function saveSurvey() {

            if (typeof id != 'undefined') {
                userService.updateSurvey(id, vm.data).then(function (res) {
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
                userService.createSurvey(vm.data).then(function (res) {
                    if (res.success) {
                        console.log('create');
                        userService.loadItems().then(function () {

                            let tmpObj = {
                                type: 'create'
                            };
                            $mdDialog.hide(tmpObj);

                            $mdDialog.cancel();

                        });
                    }
                });
            }
        }
    }
})();
