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
        model.createSurvey = createSurvey;
        model.deleteSurvey = deleteSurvey;
        model.createBlock = createBlock;
        model.updateBlock = updateBlock;
        model.deleteBlock = deleteBlock;
        model.createQuestion = createQuestion;
        model.updateQuestion = updateQuestion;
        model.deleteQuestion = deleteQuestion;

        //Answer survey
        model.createAnswer = createAnswer;
        model.updateAnswer = updateAnswer;
        model.deleteAnswer = deleteAnswer;

        //User management
        model.loadCustomers = loadCustomers;
        model.getCustomers = getCustomers;
        model.createCustomers = createCustomers;
        model.updateCustomers = updateCustomers;
        model.deleteCustomers = deleteCustomers;

        //Passing questions
        model.sendCustomerAnswer = sendCustomerAnswer;


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
        function createSurvey(credentials) {
            console.log(credentials);
            return http.post(url.survey_management.createSurvey, credentials);
        }

        function deleteSurvey(id) {
            return http.delete(url.survey_management_func(id).deleteSurvey);
        }

        function createBlock(id, data) {
            return http.post(url.survey_management_func(id).createBlock, data)
        }

        function updateBlock(id, data) {
            console.log(data);
            return http.put(url.survey_management_func(id).updateBlock, data)
        }

        function deleteBlock(id) {
            return http.delete(url.survey_management_func(id).updateBlock, {})
        }

        function createQuestion(id, credentials) {
            console.log(id, credentials);
            return http.post(url.survey_management_func(id).createQuestion, credentials)
        }

        function updateQuestion(id, credentials) {
            console.log(id, credentials);
            return http.put(url.survey_management_func(id).updateQuestion, credentials)
        }

        function deleteQuestion(id) {
            console.log(id);
            return http.delete(url.survey_management_func(id).updateQuestion, {})
        }

        //Answer survey
        function createAnswer(id, credentials) {
            console.log(id, credentials);
            return http.post(url.survey_management_func(id).createAnswer, credentials)
        }

        function updateAnswer(id, credentials) {
            console.log(id, credentials);
            return http.put(url.survey_management_func(id).updateAnswer, credentials)
        }

        function deleteAnswer(id) {
            console.log(id);
            return http.delete(url.survey_management_func(id).updateAnswer, {})
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
            return http.post(url.customers.customers, data);
        }

        function updateCustomers(id, data) {
            return http.put(url.customers_func(id).updateCustomers, data);
        }

        function deleteCustomers(id) {
            return http.delete(url.customers_func(id).updateCustomers, {});
        }

        function sendCustomerAnswer(id, data) {
            return http.post(url.customers_func(id).sendCustomerAnswer, data);
        }
    }
})();