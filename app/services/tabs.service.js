;(function () {
    'use strict';

    angular
        .module('service.tabsService', [])
        .service('tabsService', tabsService);

    tabsService.$inject = ['http', 'url', '$localStorage' , '$sessionStorage'];

    function tabsService(http, url, $localStorage, $sessionStorage) {
        let model = {};

        model.logout = logout;
        model.setActiveTab = setActiveTab;
        model.getActiveTab = getActiveTab;

        return model;

        function logout() {
            return http.get(url.logout_func($localStorage.token).logout);
        }

        function setActiveTab(tab) {
            $sessionStorage['activeTab'] = tab;
        }

        function getActiveTab() {
            return $sessionStorage['activeTab'];
        }
    }
})();