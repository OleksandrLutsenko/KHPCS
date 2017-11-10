;(function () {
    angular
        .module('factory.customers', [])
        .factory('customers', customers);


    customers.$inject = ['$localStorage', '$sessionStorage'];

    function customers($localStorage, $sessionStorage) {
        let model = {        };

        model.setActiveCustomers = setActiveCustomers;
        model.getActineCustomers = getActineCustomers;

        return model;


        function setActiveCustomers(id) {
            delete $sessionStorage['active_customers'];
            $sessionStorage['active_customers'] = id;
        }

        function getActineCustomers(id) {
            return $sessionStorage['active_customers'];
        }


    }

})();