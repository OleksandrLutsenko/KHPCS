;(function () {
    'use strict';
    angular.module('app')
        .controller('TabsController', TabsController);

    TabsController.$inject = ['userService', 'tabs', 'tabsService', '$state' , '$stateParams'];

    function TabsController(userService, tabs, tabsService, $state , $stateParams) {
        let vm = this;
        // console.log($stateParams.tabName);


        vm.user = userService.getUser();
        vm.currentNavItem = 'page1';

        vm.setActiveTab = function (tab) {
            vm.currentNavItem = tab;
        }




        // switch: asd
        //     case:

        vm.profile = function () {
            console.log('Test profile');
        };

        vm.logout = function () {
            tabsService.logout().then(function (res) {
                if (res.success === true) {
                    $state.go('login');
                    tabs.clearAfterLogout();
                } else {
                    console.log('Logout error');
                }
            });
        };
    }

})();