;(function () {
    'use strict';

    angular.module('app')
        .controller('CreateSurveyController', CreateSurveyController);


    CreateSurveyController.$inject = ['surveyService', '$mdDialog', 'data'];

    function CreateSurveyController(surveyService,  $mdDialog, data) {

        let vm = this;

        let id = data.id;

        vm.id = id;

        vm.cancel = cancel;

        function cancel() {
            $mdDialog.cancel()
        }

        vm.data = {
            name: '',
            status: '2'
        };


        if (typeof id != 'undefined') {
            let it = data.it.survey_name;
            vm.data = {
                name: it
            };
        }

        vm.saveSurvey = saveSurvey;
        function saveSurvey() {
            if (!vm.surveyForm.$invalid) {
                if (typeof id != 'undefined') {
                    surveyService.updateSurvey(id, vm.data).then(function (res) {
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
                }
                else {
                    surveyService.createSurvey(vm.data).then(function (res) {
                        if (res.success) {
                            let tmpObj = {
                                type: 'create'
                            };
                            $mdDialog.hide(tmpObj);

                            $mdDialog.cancel();

                        }
                        else {
                            console.log('errorCreate');
                        }
                    });
                }
            }
        }
    }
})();
