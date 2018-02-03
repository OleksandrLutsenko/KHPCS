;(function () {
    'use strict';

    angular
        .module('service.userService', [])
        .service('userService', userService);

    userService.$inject = ['http', 'url', '$localStorage', '$sessionStorage'];

    function userService(http, url, $localStorage, $sessionStorage) {

        //Download package pdf
        let chosenTemplates;
        let customer;


        let model = {};
        model.login = login;
        model.getToken = getToken;
        model.setToken = setToken;
        model.loadUser = loadUser;
        model.getUser = getUser;

        model.registration = registration;
        model.forgot = forgot;
        model.reset = reset;
        model.updateInfo = updateInfo;
        model.updatePass = updatePass;
        model.loadSurveysOnly = loadSurveysOnly;
        model.loadItems = loadItems;
        model.setItems = setItems;
        model.getItems = getItems;

        //DownloadContract
        model.getContract = getContract;
        model.removePdf = removePdf;

        //Download package pdf
        model.downloadPackagePDF = downloadPackagePDF;
        model.setPackData = setPackData;

        return model;

        function login(credentials) {
            return http.post(url.user.login, credentials)
        }
        function setToken(token) {
            $localStorage.token = token;
        }
        function getToken() {
            return $localStorage.token;
        }
        function loadUser() {
            return http.get(url.user.loadUser, {}).then(function (res) {
                if (res.success){
                    setUser(res.data.result);
                }
                else {
                    //need to show error msg
                }
            });
        }
        function setUser(user) {
            $localStorage.user = user;
        }
        function getUser() {
            return $localStorage.user;
        }

        function registration(token , data) {
            return http.post(url.create_adm(token).register, data)
        }

        function forgot(data) {
            return http.post(url.user.forgot, data);
        }

        function reset(token , data){
            return http.post(url.reset_func(token).resetPass , data);
        }

        function updateInfo(id , dataInfo) {
            return http.post(url.user_func(id).updateProfile , dataInfo);
        }

        function updatePass(id , data) {
            return http.post(url.user_func(id).updateProfile , data);
        }


        function loadSurveysOnly() {
            return http.get(url.survey_management_func().loadOnlySurvey);
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
        function setItems(items) {
            delete $sessionStorage['user_items'];
            $sessionStorage['user_items'] = items;
        }
        function getItems() {
            return $sessionStorage['user_items'];
        }

        //DownloadContract
        function getContract(idReport, idContract, filename) {
            return http.get(url.contract_download_func(idReport, idContract, filename).downloadPDF);
        }
        function removePdf(idReport) {
            return http.delete(url.contract_download_func(idReport).removePDF);
        }

        function downloadPackagePDF(some) {
            console.log("_______________dfsdfsdfsd________________");
            console.log(customer);
            console.log(chosenTemplates);
        }
        function setPackData(TemplatesArr, customerArr) {
            chosenTemplates = TemplatesArr;
            customer = customerArr;
        }
    }
})();