;(function () {
    'use strict';

    angular.module('app')
        .controller('SettingsController', SettingsController);



    SettingsController.$inject = ['$localStorage'];

    function SettingsController($scope) {
        let vm = this;

        vm.people = ["John","Fred","Teddy","Deloris","Brian"];

        $scope.sortableOptions = {
            placeholder: "app",
            connectWith: ".apps-container",
            update: function (event, ui) {
                // on cross list sortings recieved is not true
                // during the first update
                // which is fired on the source sortable
                if (!ui.item.sortable.received) {
                    let originNgModel = ui.item.sortable.sourceModel;
                    let itemModel = originNgModel[ui.item.sortable.index];
                    // check that its an actual moving
                    // between the two lists

                    if (originNgModel === $scope.list1 && ui.item.sortable.droptargetModel === $scope.list2) {
                        let exists = !!$scope.list2.filter(function (item) {
                            return item.title === itemModel.title
                        }).length;
                        if (exists) {
                            ui.item.sortable.cancel();
                        }
                    }
                }
            }
        }
    }

})();