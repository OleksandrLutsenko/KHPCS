;(function () {
    'use strict';

    angular.module('app')
        .controller('ContractEditorController', ContractEditorController);



    ContractEditorController.$inject = ['userService', 'survey', '$scope'];

    function ContractEditorController(userService, survey, $scope) {
        let vm = this;
        console.log('contract-editor controller start');

        CKEDITOR.replace('CKeditorArea');

        vm.testInsert = function () {
            CKEDITOR.instances.CKeditorArea.insertText('Test insert is ready');
        };

    }
})();