;(function () {
    'use strict';

    angular.module('app')
        .controller('SurveyManagementController', function ($mdDialog) {

            let vm = this;

            vm.questTab = [
                {
                    name: 'ID Verification',
                    questions: [
                        'National Insurance Number',
                        'Driving Licence Number',
                        'Passport Number',
                        'Do any of the following apply to you?',
                        'Aged over 75',
                        'Recently experienced a significant life event (e.g. Bereavement,Employment Concerns, Serious Illness Diagnosis, Marital Difficulties, Financial Hardship)',
                        'Suffering from any severe and/or long term illness conditions (including mental illness)',
                        'Suffering from any learning difficulties?',
                        'Difficulties with the English language'
                    ]
                },
                {
                    name: 'General information',
                    questions: [
                        'First Name(s)',
                        'Surname',
                        'Marital Status',
                        'Date of Birth',
                        'Nationality',
                        'UK Resident?',
                        'UK Domiciled?',
                        'Residential Address',
                        'Correspondence Address (if different)',
                        'Home Phone',
                        'Mobile Phone',
                        'Work Phone',
                        'Email Address',
                        'Best time to contact'
                    ]
                },
                {
                    name: 'Employment & income',
                    questions: [
                        'Employment Status(employed, self-employed, retired,partner, director, etc.)',
                        'Occupation',
                        'Employer Name',
                        'Remaining Contract Duration (if applicable)',
                        'Details of Employer, Pension & Other, Benefits',
                        'At what age do you currently intend to retire?',
                        'In which country do you currently intend to retire?'
                    ]
                },
                {
                    name: 'Monthly expenditure ',
                    questions: []
                },
                {
                    name: 'Assets (excluding investments/pensions)',
                    questions: []
                },
                {
                    name: 'Liabilities',
                    questions: []
                },
                {
                    name: 'Investment assets',
                    questions: []
                },
                {
                    name: 'Existing protection plans',
                    questions: []
                },
                {
                    name: 'Existing money purchase pension plans',
                    questions: []
                }
            ];

            // SurveyManagementController.$inject = [];     //rudimentary code :\


            vm.showEditSM = function (ev, question) {
                $mdDialog.show({
                    controller: ShowEditSMCtrl,
                    controllerAs: 'vm',
                    templateUrl: 'components/survey-management/edit-question/edit-question.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                });
                function ShowEditSMCtrl($mdDialog) {
                    let vm = this;
                    vm.cancel = function () {
                        $mdDialog.cancel();
                    };
                    vm.question = question;
                    vm.inputCheck = function (inputValueNum) {
                        if (inputValueNum === 1) {
                            return false;
                        }
                        else {
                            return true;
                        }
                    };
                }
            };


            vm.deleteQuestionSM = function (ev) {
                $mdDialog.show({
                    controller: CancelController,
                    controllerAs: 'vm',
                    templateUrl: 'components/survey-management/delete/delete.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
            });
                function CancelController($mdDialog) {
                    let vm = this;
                    vm.cancel = function () {
                        $mdDialog.cancel();
                    };
                }
            };

            vm.test = function () {
                alert('Test');
            };

            ////////////////Qest list////////////////////////

            vm.jollo = 'hello QL';

            vm.QLOption = [
                'Active',
                'Deactive',
                'Archive'
            ];


            vm.QLCurrentStatus = vm.QLOption[0];

            vm.announceClick = function(index) {
                $mdDialog.show(
                    $mdDialog.alert()
                        // .title('You clicked!')
                        .textContent('Status changed to \"' + index + '\"')
                        .ok('Ок')

                );
                vm.QLCurrentStatus = index;
            };

            vm.statusQL = true;
            vm.statusBlock = false;

            vm.inversion = function () {
                vm.statusQL = false;
                vm.statusBlock = true;
            };



/////////////////////////activeTab/////////////////////////////
            vm.activeTab;

            vm.activeTabFunc = function (nameActiveTab) {
                vm.activeTab = nameActiveTab;
            };

            vm.showeDott = function (nameCurrentTab) {
                if (nameCurrentTab === vm.activeTab){
                    return true;
                }
                else {
                    return false;
                }
            };
//////////////////////////////////////////////////////

            ////////////////edit or dell questionnaire////////////////////////
            vm.EditSection = function (ev, nameSection) { //////////////Bad
                $mdDialog.show({
                    controller: EditSectionCtrl,
                    controllerAs: 'vm',
                    templateUrl: 'components/survey-management/edit-section/edit-section.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                });
                function EditSectionCtrl($mdDialog) {
                    let vm = this;
                    vm.cancel = function () {
                        $mdDialog.cancel();
                    };

                    vm.AC = nameSection; ///////////////Bad
                }
            };

            vm.blockSelection = function (name) {
                if(name === 'Edit'){
                    vm.EditSection(0, vm.activeTab); //////////////Bad
                }
                else {
                    vm.deleteQuestionSM();
                }
            };

            vm.showPrompt = function(ev) {
                // Appending dialog to document.body to cover sidenav in docs app
                var confirm = $mdDialog.prompt()
                    .title('Please enter the name of the new questionnaire')
                    // .textContent('Bowser is a common name.')
                    .placeholder('Add name')
                    .ariaLabel('Dog name')
                    // .initialValue('Buddy')
                    .targetEvent(ev)
                    .required(true)
                    .ok('Save')
                    .cancel('Cancel');

                $mdDialog.show(confirm).then(function(result) {
                    vm.status = 'You decided to name your dog ' + result + '.';
                }, function() {
                    vm.status = 'You didn\'t name your dog.';
                });
            };

        });
})();