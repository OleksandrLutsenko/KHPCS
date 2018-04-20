;(function () {
    'use strict';
    angular
        .module('app')
        .controller('CopyCustomer', CopyCustomer);

    CopyCustomer.$inject = ['data', '$mdDialog', 'customerService', 'toastr'];

    function CopyCustomer(data, $mdDialog, customerService, toastr) {
        let vm = this;

        vm.companies = data.data.companies;
        let customer = data.data.customer;
        console.log(customer);

        vm.copy = copy;
        vm.cancel = cancel;

        function copy() {
            let data = {
                company_id: Number(vm.data.company_id),
                name: customer.name,
                surname: customer.surname,
                classification: customer.classification
            };
            console.log(data);

            customerService.copyCustomer(data).then(function (res) {
                if (res.success) {
                    let tmpData = {
                        success: true,
                        data: res.data
                    };
                    $mdDialog.hide(tmpData);
                } else {
                    toastr.error('Error copying customer');
                }
            })
        }

        function cancel() {
            let tmpData = {
                success: false,
                data: null
            };
            $mdDialog.hide(tmpData)
        }
    }
})();