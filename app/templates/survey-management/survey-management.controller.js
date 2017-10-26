;(function () {
    'use strict';

    angular.module('app')
        .controller('SurveyManagementController', SurveyManagementController);


    SurveyManagementController.$inject = [];

    function SurveyManagementController() {
        let vm = this;

        vm.qestTab = [
            {name: 'ID Verification',
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
            {name: 'General information',
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
            {name: 'Employment & income',
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
            {name: 'Monthly expenditure ',
                questions: []
            },
            {name: 'Assets (excluding investments/pensions)',
                questions: []
            },
            {name: 'Liabilities',
                questions: []
            },
            {name: 'Investment assets',
                questions: []
            },
            {name: 'Existing protection plans',
                questions: []
            },
            {name: 'Existing money purchase pension plans',
                questions: []
            },
            {name: 'example',
                questions: []
            },
            {name: 'example',
                questions: []
            },
            {name: 'example',
                questions: []
            },
        ];

    }
})();