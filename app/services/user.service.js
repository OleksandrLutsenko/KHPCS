;(function () {
    'use strict';

    angular.module('service.userService', [])
        .service('userService', userService);

    userService.$inject = ['http', 'url', '$localStorage', '$sessionStorage'];

    function userService(http, url, $localStorage, $sessionStorage) {
        let model = {};
        model.login = login;
        model.registration = registration;
        model.setUser = setUser;
        model.getUser = getUser;
        model.loadItems = loadItems;
        model.getItems = getItems;
        // model.addSurvey = getItems;
        model.createBlock = createBlock;
        model.createQuestion = createQuestion;

        return model;

        function login(credentials) {
            return http.post(url.user.login, credentials)
        }

        function registration(credentials) {
            return http.post(url.user.register, credentials)
        }

        function setUser(user) {
            $localStorage.user = user;
        }

        function getUser() {
            return $localStorage.user;
        }

        function loadItems() {
            return http.get(url.user.getItems, {}).then(function (res) {
                if (res.success) {
                    setItems(res.data);
                } else {
                     //need to show error msg
                }
            });
        }

        function getItems() {
            return $sessionStorage['user_items'];
        }

        function setItems(items) {
            delete $sessionStorage['user_items'];
            $sessionStorage['user_items'] = items;
        }


        // Survey management
        function createBlock(Snum, credentials) {
            return http.post(url.survey_management(Snum).block, credentials)
        }

        function createQuestion (Snum, credentials) {
            return http.post(url.survey_management(Snum).question, credentials)
        }
    }
})();