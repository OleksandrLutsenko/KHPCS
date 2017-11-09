;(function () {
    'use strict';

    angular.module('service.userService', [])
        .service('userService', userService);

    userService.$inject = ['http', 'url', '$localStorage', '$sessionStorage'];

    function userService(http, url, $localStorage, $sessionStorage) {
        let model = {};
        model.loadAll = loadAll;
        model.login = login;
        model.registration = registration;
        model.setUser = setUser;
        model.getUser = getUser;
        model.loadItems = loadItems;
        model.getItems = getItems;
        // model.addSurvey = getItems;
        model.createBlock = createBlock;
        model.createQuestion = createQuestion;
        model.updateQuestion = updateQuestion;

        //Answer survey
        model.createAnswer = createAnswer;
        model.updateAnswer = updateAnswer;

        //User management
        model.loadCustomers = loadCustomers;
        model.getCustomers = getCustomers;
        model.createCustomers = createCustomers;
        model.updateCustomers = updateCustomers;


        return model;

        function loadAll() {
            loadItems();
            loadCustomers();
        }

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
        function createBlock(id, credentials) {
            return http.post(url.survey_management_func(id).block, credentials)
        }

        function createQuestion (id, credentials) {
            console.log(id, credentials);
            return http.post(url.survey_management_func(id).createQuestion, credentials)
        }

        function updateQuestion (id, credentials) {
            console.log(id, credentials);
            return http.put(url.survey_management_func(id).updateQuestion, credentials)
        }

        //Answer survey
        function createAnswer (id, credentials) {
            console.log(id, credentials);
            return http.post(url.survey_management_func(id).createAnswer, credentials)
        }

        function updateAnswer (id, credentials) {
            console.log(id, credentials);
            return http.put(url.survey_management_func(id).updateAnswer, credentials)
        }

        



        //User management
        function loadCustomers() {
            return http.get(url.customers.customers, {}).then(function (res) {
                console.log(res);
                if (res.success) {
                    setCustomers(res.data);
                } else {
                    //need to show error msg
                }
            });
        }
        function getCustomers() {
            return $sessionStorage['customers_index'];
        }

        function setCustomers(items) {
            delete $sessionStorage['customers_index'];
            $sessionStorage['customers_index'] = items;
        }

        function createCustomers(data) {
            return http.post(url.customers.customers, data)
        }
        function updateCustomers(id, data) {
            return http.put(url.customers_func(id).updateCustomers, data)
        }
    }
})();