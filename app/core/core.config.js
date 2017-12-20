;(function () {
    angular
        .module('app')
        .config(mainConfig);
    mainConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

    function mainConfig($stateProvider, $urlRouterProvider , $stateParams) {


        $urlRouterProvider.otherwise('/login');

        $stateProvider

            .state('tab', {
                url: '/tab',
                templateUrl: 'templates/tabs/tabs.html',
                controller: 'TabsController',
                controllerAs: 'vm'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'templates/login/login.html',
                controller: 'LoginController',
                controllerAs: 'vm'
            })
            .state('registration', {
                url: '/sign-up',
                templateUrl: 'templates/registration/registration.html',
                controller: 'RegistrationController',
                controllerAs: 'vm'
            })
            .state('forgot', {
                url: '/sign-up/forgot',
                templateUrl: 'templates/forgot-password/forgot-password.html',
                controller: 'ForgotController',
                controllerAs: 'vm'
            })
            .state('reset', {
                url: '/sign-up/reset/:token',
                templateUrl: 'templates/reset-password/reset-password.html',
                controller: 'ResetController',
                controllerAs: 'vm',
                resolve:{
                    token: ['$stateParams', function($stateParams){
                        return $stateParams.token;
                    }]
                }
            })
            .state('tab.user-management', {
                url: '/user-management',
                templateUrl: 'templates/user-management/user-management.html',
                controller: 'UserManagementController',
                controllerAs: 'vm',
                resolve: {
                    load: function (customerService) {
                        return customerService.loadCustomers();
                    }
                }
            })
            .state('tab.survey-management', {
                url: '/survey-management',
                templateUrl: 'templates/survey-management/survey-management.html',
                controller: 'SurveyManagementController',
                controllerAs: 'vm',
                resolve: {
                    load: function (userService) {
                        return userService.loadItems();
                    }
                }
            })

            .state('tab.contract-editor', {
                url: '/contract-editor',
                templateUrl: 'templates/contract-editor/contract-editor.html',
                controller: 'ContractEditorController',
                controllerAs: 'vm',
                resolve: {
                    load: function (userService) {
                        return userService.loadItems();
                    }
                }
            })

            .state('tab.settings', {
                url: '/settings',
                templateUrl: 'templates/settings/settings.html',
                controller: 'SettingsController',
                controllerAs: 'vm'
            })
            .state('tab.survey-block', {
                url: '/survey-block',
                templateUrl: 'templates/survey-block/survey-block.html',
                controller: 'SurveyBlockController',
                controllerAs: 'vm',
                resolve: {
                    items: function (blockService, survey) {
                        let idSurvey = survey.getActineSurvey().id;

                        return blockService.loadOneSurvey(idSurvey).then(function (res) {
                            if(res.success){
                                return res.data.survey.blocks;
                            }
                        });
                    }
                }
            })
            .state('tab.survey-block.survey-question', {
                url: '/survey-question',
                templateUrl: 'templates/survey-question/survey-question.html',
                controller: 'SurveyQuestionController',
                controllerAs: 'vm',
                resolve: {
                    items: function (blockService, survey) {
                        let idS = survey.getActineSurvey();
                        let idSurvey = idS.id;

                        return blockService.loadOneSurvey(idSurvey).then(function (res) {
                            if(res.success){
                                return res.data.survey.blocks;
                            }
                        });
                    }
                }
            })
            .state('tab.passing-question', {
                url: '/passing-question',
                templateUrl: 'templates/passing-questions/passing-questions.html',
                controller: 'PassingQuestionController',
                controllerAs: 'vm',
                resolve: {
                    customerAnswer: function (userService, customers, survey) {
                        return userService.loadItems().then(function () {
                            let indexActiveSurvey = survey.getActiveQuestionair();

                            let id = {
                                customer: customers.getActiveCustomers(),
                                survey: userService.getItems()[indexActiveSurvey].id
                            };

                            return userService.getCustomerAnswer(id).then(function (res) {
                                if(res.success){
                                    return res.data.customerAnswers
                                }
                                else{
                                    console.log('error customer answer');
                                }
                            });
                        });
                    }
                }
            })
    }
})();