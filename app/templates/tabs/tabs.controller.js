;(function () {
    'use strict';
    angular.module('app')
        .controller('TabsController', TabsController);

    TabsController.$inject = ['userService', 'tabs', 'tabsService', '$state'];

    function TabsController(userService, tabs, tabsService, $state) {
        let vm = this;


        vm.user = userService.getUser();


       function initTab() {
           if( tabsService.getActiveTab()){
               vm.currentNavItem =  tabsService.getActiveTab();
           }else {
               vm.currentNavItem = 'page1';
           }
       }
       initTab();



        vm.setActiveTab = function (tab) {
            tabsService.setActiveTab(tab);
        };





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