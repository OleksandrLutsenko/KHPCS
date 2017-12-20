;(function () {
    angular.module('app',
        [
            'app.core',
            'blocks.directives',
            'blocks.request',
            'blocks.services',
            'blocks.filters',

        ])
        .run(runBlock);

    runBlock.$inject = ['$localStorage', '$state', '$rootScope'];

    // function runBlock($localStorage, $state) {
    //     // if(!$localStorage.token) {
    //     //     $state.go('login');
    //     // }
    // }

    function runBlock($localStorage, $state, $rootScope) {
        // if(!$localStorage.token) {
        //     $state.go('login');
        // }
        console.log("run");
        function erl() {
            return 10+10;

        }
        console.log(erl());

        $rootScope.$on('$stateChangeStart',
            function () {
                console.log('stateChangeStart');
            }
        );



        // var $scope = $injector.get('$rootScope');

        $state.go('login');
        // $state.go('tab.user-management');
        // $state.go('tab.survey-management');
        // $rootScope.$state.go('login');

    }









})();