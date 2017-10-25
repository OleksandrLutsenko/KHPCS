;(function () {

    'use strict';

    angular.module('app')

        .controller('UserManagementController', function ($scope, $mdDialog) {

            $scope.showAdvanced = function (ev) {

                $mdDialog.show({

                    controller: DialogController,
                    templateUrl: 'templates/user-management/addClient.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                });

            };

            function DialogController($scope, $mdDialog) {
                $scope.hide = function () {
                    $mdDialog.hide();
                };

                $scope.cancel = function () {
                    $mdDialog.cancel();
                };

                $scope.answer = function (answer) {
                    $mdDialog.hide(answer);
                };
            }
        });
    })();