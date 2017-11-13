(function () {
    'use strict';
    angular
        .module('factory.request', [])
        .factory('http', http);

    http.$inject = ['$http', '$q', '$localStorage'];

    /**
     * Wrapper over the standard http function
     */

    function http($http, $q, $localStorage) {
        console.log('create request service');

        return {
            get: function (url, data) {
                return request('GET', url, data);
            },
            post: function (url, data) {
                return request('POST', url, data);
            },
            put: function (url, data) {
                return request('PUT', url, data);
            },
            delete: function (url, data) {
                return request('DELETE', url, data);
            }
            // file: function (url, data) {
            //     return requestFile(url, data);
            // }
        };


        /**
         * Main request function
         * @param {string} method - Method name
         * @param {string} url - Request url
         * @param {object} data - Data to request
         * @returns {promise}
         */

        function request(method, url, data) {

            let user = $localStorage.user;


            let config = {
                dataType: 'json',
                method: method,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            };
            if(typeof user != 'undefined') {
                config.headers.Authorization = 'Bearer ' + user.api_token;
            }

            if (method === 'GET') {
                config.params = data;
                config.timeout = 20000;
            }
            else {
                config.data = data;
            }

            config.url = url;

            console.log(config, 'request')
            return $http(config)
                .then(requestComplete)
                .catch(requestFailed);
        }

        /**
         * Function for sending files
         * @param {string} url - Request url
         * @param {object} data - Data to request
         * @returns {promise}
         */

        // function requestFile(url, data) {
        //
        //     // if ($sessionStorage.auth_key) {
        //     //     url = url + '?auth_key=' + $sessionStorage.auth_key;
        //     // }
        //
        //     var ft = new FileTransfer();
        //
        //     var promise = $q.defer();
        //     ft.upload(data.file.fullPath, encodeURI(url), function (response) {
        //         console.info('response complete', JSON.parse(response.response));
        //         promise.resolve(JSON.parse(response.response));
        //     }, function (error) {
        //         console.log('error', error);
        //         promise.reject(error.body);
        //     }, {
        //         fileName: data.file.name,
        //         fileKey: 'file',
        //         mimeType: 'video/mp4',
        //         httpMethod: 'POST',
        //         chunkedMode: false,
        //         params: data
        //     });
        //
        //     return promise.promise;
        // }


        /**
         * Callback function for failed request
         * @param err
         * @returns {promise}
         */
        function requestFailed(err) {
            console.info('error', err.config.url, err);

            if (err.data == null || !err.data.error) {
                if (err.status === 200) {
                    console.log('Server error: ' + err.data);
                }
                else if (err.status === -1) {
                    console.log('Server is not available');
                }
                else if (err.status === 0) {
                    console.log('There is no Internet connection');
                }
                else if (err.status === 500) {
                    console.log('Server error: ' + err.status + ' ' + err.data.message);
                }
                else {
                    console.log('Server error: ' + err.status + ' ' + err.statusText);
                }
                // console.log('XHR Failed: ' + err.status);
            }
            else {
                console.log(err.data.error);
            }
            let res = {status: false};
            return (res);
        }

        /**
         * Callback function for success request
         * @param response
         * @returns {promise}
         */

        function requestComplete(response) {
            // let promise = $q.defer();
            // console.info('response complete', response.config.url);
            // // console.log(!response.data.status, '123')
            // if (response.data.status) {
            //     promise.resolve(response.data);
            // }
            // else {
            //     promise.reject(response.data);
            // }

            return response.data;


        }
    }
})();