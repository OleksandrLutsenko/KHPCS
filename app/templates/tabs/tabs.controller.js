;(function () {
    'use strict';
    angular.module('app')
        .controller('TabsController', TabsController);

    TabsController.$inject = ['userService'];

    function TabsController(userService) {
        let vm = this;

        vm.user = userService.getUser();

        vm.currentNavItem = 'page1'

    }

})();

