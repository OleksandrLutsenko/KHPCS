;(function () {
    'use strict';

    angular.module('app')
        .controller('SettingsController', SettingsController);



    SettingsController.$inject = ['$localStorage'];

    function SettingsController() {
        let vm = this;


        // vm.showSurvey = showSurvey;
        //
        // vm.items = userService.getItems();
        //
        // function showSurvey(id, indexSurvey) {
        //     survey.setActineSurvey(id, indexSurvey);
        // }

//         function addObserve() {
//             if(!clientData.clientAvailable()) {
//                 return;
//             }
//             $mdDialog.show({
//                 clickOutsideToClose: true,
//                 controller: 'AddItemInTab',
//                 controllerAs: 'vm',
//                 templateUrl: 'templates/add-item-in-tab/add-item-in-tab.html',
//                 parent: angular.element(document.body),
//                 resolve: {},
//                 locals: {
//                     title: "add-observe"
//                 },
//             }).then(function (res) {
//                 observe.create({
//                     name: res.item.observe,
//                     client_id: clientData.getCurrentClient().id
//                 }).then(
//                     function (res) {
//                         vm.allObservers.push(res.observer);
//                         toastr.success(messagesNotice.success.created);
//                     }
//                 );
//             });
//         }
//         function editObserve(observeItem, index) {
//             $mdDialog.show({
//                 clickOutsideToClose: true,
//                 controller: 'EditItemInTab',
//                 controllerAs: 'vm',
//                 templateUrl: 'templates/edit-item-in-tab/edit-item-in-tab.html',
//                 parent: angular.element(document.body),
//                 resolve: {},
//                 locals: {   index: index,
//                     observe: observeItem,
//                     title: 'edit-observe'},
//             }).then(function (res) {
//                 observe.update({
//                     id:res.item.id,
//                     name:res.item.name,
//                     client_id:res.item.client_id
//                 }).then(function (data) {
//                     vm.allObservers[vm.allObservers.indexOf(observeItem)] = data.observer;
//                     toastr.success(messagesNotice.success.updated);
//                 });
//             });
//         }
//
//
//         ;(function () {
//             angular
//                 .module('app')
//                 .controller('EditItemInTab', EditItemInTab);
//
//             / @ngInject /
//             function EditItemInTab($mdDialog, locals, toastr, messagesNotice, clientData) {
//
//                 var vm = this;
//                 vm.item = {};
//                 if (locals.user) {
//                     angular.copy(locals.user, vm.item);
//                 }
//                 if (locals.team) {
//                     angular.copy(locals.team, vm.item);
//                 }
//                 if (locals.directorate) {
//                     angular.copy(locals.directorate, vm.item);
//                 }
//
//                 if (locals.observe) {
//                     angular.copy(locals.observe, vm.item);
//                 }
//
//                 if (locals.data && locals.title === 'directorate') {
//                     angular.copy(locals.data, vm.item);
//                 }
//
//                 if (locals.title === 'edit-theme-team') {
//                     angular.copy(locals.theme, vm.item);
//                 }
//
//                 if (locals.client_promo && locals.title === 'client_promo') {
//                     vm.item.name = locals.client_promo;
//                 }
//
//                 if(locals.notice && locals.title === 'edit-notice'){
//                     vm.item.name = locals.notice;
//                 }
//
//
//                 vm.locals = locals;
//                 vm.item.types = [
//                     {id: 0, role: 1, name: "User"},
//                     {id: 1, role: 5, name: "QI admin"}
//                 ];
//
//                 if (vm.item.role == 1) {
//                     vm.item.usertype = vm.item.types[0];
//                 } else if (vm.item.role == 5) {
//                     vm.item.usertype = vm.item.types[1];
//                 }
//
//                 vm.speciality_title = clientData.getCurrentClientData().settings.speciality_title || "Speciality";
//                 vm.grade_title = clientData.getCurrentClientData().settings.grade_title || "Grade";
//                 vm.directorate_title = clientData.getCurrentClientData().settings.directorate_title || "Directorate";
//
//                 vm.close = close;
//                 vm.edit = edit;
//
//                 function close() {
//                     $mdDialog.cancel();
//                 }
//
// // // function for ask if we plan add some item to client (users, themes, etc.)
//                 function edit() {
//                     if (vm.locals.title == 'edit-domain') {
//                         if (vm.form.$error.pattern) {
//                             toastr.error(messagesNotice.error.validDomain);
//                             return;
//                         }
//                         if (vm.item.name.indexOf("@") == -1) {
//                             vm.item.name = "@" + vm.item.name;
//                         }
//                     }
//
//                     if (vm.locals.title == 'user') {
//                         if (vm.form.$error.pattern) {
//                             toastr.error(messagesNotice.error.validEmail);
//                             return;
//                         }
//                     }
//
//                     if (vm.form.$error.minlength || vm.form.$error.required) {
//                         toastr.error(messagesNotice.error.completeField);
//                         return;
//                     }
//
//                     if (vm.form.$invalid) {
//                         return;
//                     }
//
//                     $mdDialog.hide({item: vm.item});
//                 }
//             }
//
//         })();



    }
})();