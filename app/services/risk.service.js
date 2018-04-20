;(function () {
    'use strict';

    angular
        .module('service.riskService', [])
        .service('riskService', riskService);

    riskService.$inject = ['http', 'url', '$localStorage' , '$sessionStorage'];

    function riskService(http, url, $localStorage, $sessionStorage) {
        let model = {};

        model.getRisks = getRisks;
        model.createRisk = createRisk;
        model.updateRisk = updateRisk;
        model.deleteRisk = deleteRisk;

        return model;

        function getRisks(data) {
            return http.post(url.risk_func().getRisks, data);
        }

        function createRisk(data) {
            return http.post(url.risk_func().createRisk, data);
        }

        function updateRisk(id, data) {
            return http.post(url.risk_func(id).updateRisk, data);
        }

        function deleteRisk(id) {
            return http.delete(url.risk_func(id).deleteRisk);
        }
    }
})();