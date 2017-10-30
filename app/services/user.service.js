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
        // model.loadItems = loadItems;
        // model.getItems = getItems;
        // model.setMood = setMood;
        return model;

        /**
         *
         * @param credentials
         */
        function login(credentials) {
            return http.post(url.user.login, credentials)
        }

        /**
         *
         * @param credentials
         */
        function registration(credentials) {
            return http.post(url.user.register, credentials)
        }

        /**
         *
         * @param user
         */
        function setUser(user) {
            $localStorage.user = user;
        }

        /**
         *
         * @returns {*}
         */
        function getUser() {
            return $localStorage.user;
        }

        /**
         * get team list before improvement will be sended
         */
        // function loadItems() {
        //     return http.get(url.user.getItems, {}).then(function (res) {
        //         if (res.success) {
        //             setItems(res);
        //         } else {
        //             //need to show error msg
        //         }
        //     });
        // }

        /**
         *
         * @returns {*}
         */
        // function getItems() {
        //     return $sessionStorage['user_items'];
        // }

        /**
         *
         * @param items
         */
        // function setItems(items) {
        //     delete $sessionStorage['user_items'];
        //     $sessionStorage['user_items'] = items;
        // }
        /**
         * Function for set user mood
         * @param data
         * @param {number} data.level - user mood
         */
        // function setMood(data) {
        //     return http.post(url.mood.set, data);
        // }

    }
})();