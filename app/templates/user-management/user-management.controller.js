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
                    clickOutsideToClose:true
                });
                function DialogController($scope, $mdDialog) {

                    $scope.cancel = function() {
                        $mdDialog.cancel();

                    };


                }
            };

            $scope.showEditClient = function (ev) {

                $mdDialog.show({
                    controller:editClientController,
                    templateUrl: 'templates/user-management/editClient.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose:true
                });
                function editClientController($scope, $mdDialog) {
                    $scope.cancel = function() {
                        $mdDialog.cancel();
                    };
                }
            };


        });

    })();

