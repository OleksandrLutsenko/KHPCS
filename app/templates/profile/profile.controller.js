;(function () {
    'use strict';
    angular.module('app')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['userService', 'toastr', 'tabsService'];

    function ProfileController(userService, toastr, tabsService) {
        let vm = this;
        tabsService.startTab('page1');

        vm.user = userService.getUser();

        let users = vm.user;

        if (typeof vm.user.id !== 'undefined') {
            vm.dataInfo = {
                id: users.id,
                name: users.name,
                email: users.email
            }
        }

        let id = vm.dataInfo.id;

        vm.updateProfileInfo = updateProfileInfo;

        function updateProfileInfo() {
            if (vm.profile.$invalid) {
                return;
            } else {
                userService.updateInfo(id, vm.dataInfo).then(function (res) {
                    if (res.success) {
                        userService.loadUser().then(function () {
                            userService.loadItems().then(function () {
                            })
                        });

                        if (!vm.show) {
                            toastr.success('Profile was updated');
                        }

                    } else {
                        toastr.error('This email is already taken ');
                    }
                });

                if (vm.show === true) {
                    if (vm.profilePass.$invalid || vm.data.password !== vm.data.password_confirmation) {
                         return;
                    } else {
                        userService.updatePass(id, vm.data).then(function (res) {
                            if (res.success) {
                                userService.loadUser().then(function () {
                                    userService.loadItems().then(function () {
                                    })
                                });

                                toastr.success('Profile was updated');
                            } else {
                                console.log('error');
                                toastr.error('Current password is incorrect');
                            }
                        })
                    }
                }
            }
        }

        vm.menu = menu();

        function menu() {
            let show = [{}];
            return {
                change: change,
                isShow: isShow
            };

            function change(data) {
                show[data] = !show[data];
                vm.show = show[data];
            }

            function isShow(data) {
                return show[data]
            }
        }

    }
}());