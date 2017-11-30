;(function () {
    'use strict';
    angular.module('app')
        .controller('TabsController', TabsController);

    TabsController.$inject = ['userService'];

    function TabsController(userService) {
        let vm = this;

        vm.user = userService.getUser();
        console.log(vm.user.role_id);

        vm.currentNavItem = "page1";

    }

})();

