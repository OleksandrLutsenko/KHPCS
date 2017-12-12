;(function () {
    'use strict';

    angular
        .module('service.tabsService', [])
        .service('tabsService', tabsService);

    tabsService.$inject = ['http', 'url', '$localStorage'];

    function tabsService(http, url, $localStorage) {
        let model = {};

        model.logout = logout;

        return model;

        function logout() {
            return http.get(url.logout_func($localStorage.token).logout);
        }
    }
})();