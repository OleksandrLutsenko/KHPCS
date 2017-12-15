;(function () {
    'use strict';
    angular.module('app')
        .controller('TabsController', TabsController);

    TabsController.$inject = ['userService', '$mdSidenav'];

    function TabsController(userService, $mdSidenav) {
        let vm = this;

        vm.user = userService.getUser();

        vm.currentNavItem = 'page1';

        vm.closeNavButton = closeNav;
        function closeNav() {
            $mdSidenav('nav').close();
        }

        vm.toggleOpenNav = buildToggler('nav');
        function buildToggler(nav) {
            return function () {
                $mdSidenav(nav).toggle();
            };
        }


    }

})();

