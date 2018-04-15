;(function () {
    'use strict';
    angular
        .module('app')
        .controller('CommonQuestListController', CommonQuestListController);

    CommonQuestListController.$inject = ['$mdDialog', 'data'];

    function CommonQuestListController($mdDialog, data) {
        let vm = this;
        let items = [
            {
                title: "Common Qest Text1",
                type: 2,
                validation_type: 0,
                characters_limit: 99
            },
            {
                title: "Common Quest  Date2",
                type: 3,
                validation_type: 0,
                characters_limit: 30,
                common_id: 10
            },
            {
                answers: [],
                title: "Common Qest Country3",
                type: 4,
                validation_type: 0,
                characters_limit: 30
            }
        ];

        vm.drag = false;

        vm.items = items;
        vm.cancel = cancel;
        vm.pasteVar = pasteVar;
        vm.sortableOptions = {
            axis: "y",
            disabled: vm.drag,

            stop: function (e, ui) {
                console.log('Its worck!!!!');
            }
        }

        vm.dragStop = dragStop;

        for (let i = 0; i < 20; i++){
            let tempItem = {
                answers: [],
                title: "Common Qest Text" + (3+i),
                type: 2,
                validation_type: 0,
                characters_limit: 99
            };
            items.push(tempItem);

        };



        function cancel() {
            $mdDialog.cancel();
        }

        function pasteVar(item) {
            $mdDialog.hide(item);
        }

        function dragStop() {
            console.log(!vm.searchItem.title);
            if (vm.searchItem.title){
                vm.drag = true;
            } else {
                vm.drag = false;
            }
        }






    }
})();