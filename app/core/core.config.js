;(function () {
    angular
        .module('app')
        .config(mainConfig);
п
    mainConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

    function mainConfig($stateProvider, $urlRouterProvider) {


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
            .state('tab.user-management', {
                url: '/user-management',
                templateUrl: 'templates/user-management/user-management.html',
                controller: 'UserManagementController',
                controllerAs: 'vm',
                resolve: {
                    load: function (userService) {
                        return userService.loadCustomers().then(function () {
                            userService.loadItems();
                        });
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
                controllerAs: 'vm'
            })
            .state('tab.survey-block.survey-question', {
                url: '/survey-question',
                templateUrl: 'templates/survey-question/survey-question.html',
                controller: 'SurveyQuestionController',
                controllerAs: 'vm'
            })
            .state('tab.passing-question', {
                url: '/passing-question',
                templateUrl: 'templates/passing-questions/passing-questions.html',
                controller: 'PassingQuestionController',
                controllerAs: 'vm',
                resolve: {
                    customaerAnswer: function (userService, customers, survey) {
                        let indexActiveSurvey = survey.getActiveQuestionair();

                        let id = {
                            customer: customers.getActiveCustomers(),
                            survey: userService.getItems()[indexActiveSurvey].id
                        };

                        return userService.getCustomerAnswer(id);
                    }
                }
            })
    }
})();

