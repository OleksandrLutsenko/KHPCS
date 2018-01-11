;(function () {
    'use strict';

    angular
        .module('service.companyService', [])
        .service('companyService', companyService);

    companyService.$inject = ['http', 'url' , '$sessionStorage' ];

    function companyService(http, url , $sessionStorage) {
        let model = {};

        model.inviteAdm = inviteAdm;
        model.createCompany = createCompany;
        model.loadCompany = loadCompany;
        model.getCompany = getCompany;
        model.getCompany = getCompany;
        model.companyDel = companyDel;
        model.loadOneCompany = loadOneCompany;

        return model;

        /////////////////////////////////////
        function inviteAdm (data) {
            return http.post(url.company_management.inviteAdm, data);
        }

        function createCompany(data) {
            return http.post(url.company.createCompany, data);
        }

        function loadCompany() {
            return http.get(url.company.company, {}).then(function (res) {
                if(res.success){
                    setCompany(res.data);
                    return res;
                }
            });
        }

        function setCompany(data) {
            delete $sessionStorage['company_only'];
            $sessionStorage['company_only'] = data;
        }
        function getCompany() {
            return $sessionStorage['company_only'];
        }

        function companyDel(id) {
            return http.delete(url.company_func(id).company);
        }

        function loadOneCompany(id) {
            return http.get(url.company_func(id).company );
        }

    }
})();