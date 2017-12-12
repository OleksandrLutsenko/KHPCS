;(function () {
    angular
        .module('factory.tabs', [])
        .factory('tabs', tabs);

    tabs.$inject = ['$localStorage', '$sessionStorage'];

    function tabs($localStorage, $sessionStorage) {
        let model = {};
        model.clearAfterLogout = clearAfterLogout;

        return model;

        function clearAfterLogout() {
            delete $localStorage['token'];
            delete $localStorage['user'];

            delete $sessionStorage['user_items'];
            delete $sessionStorage['customers_index'];
            delete $sessionStorage['active_survey_id'];
            delete $sessionStorage['active_survey_index'];
            delete $sessionStorage['active_block_id'];
            delete $sessionStorage['active_block_index'];

        }

    }
})();