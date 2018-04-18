;(function () {
    'use strict';
    angular
        .module('app')
        .controller('CopyCustomer', CopyCustomer);

    CopyCustomer.$inject = ['data', '$mdDialog', 'customerService'];

    function CopyCustomer( data, $mdDialog, customerService) {
        let vm = this;

        vm.companies = data.data.companies;
        let customer = data.data.customer;

        vm.copy = copy;
        vm.cancel = cancel;

        function copy() {
            let data = {
                company_id: Number(vm.data.companyId),
                name: customer.name,
                surname: customer.surname,
                classification: customer.classification
            };
            console.log(data);

            // customerService.copyCustomer(data).then(function (res) {
            //     console.log(res);
            //     if (res.success) {
            //         let tmpData = res.someDATA;
            //         $mdDialog.hide(tmpData);
            //     }
            // })
            $mdDialog.hide("Some(delThis)");
        }
        function cancel() {
            $mdDialog.cancel()
        }
    }
})();