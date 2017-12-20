;(function () {
    'use strict';
    angular.module('app')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['userService',  'toastr'];

    function ProfileController(userService,  toastr) {
        let vm = this;

        vm.user = userService.getUser();

        let users = vm.user;

        if (typeof vm.user.id != 'undefined') {
            vm.dataInfo = {
                id: users.id,
                name: users.name,
                email: users.email
            }
        }

        let id = vm.dataInfo.id;

        vm.updateProfileInfo = updateProfileInfo;

        function updateProfileInfo() {
            userService.updateInfo(id, vm.dataInfo).then(function (res) {
                if (res.success) {
                    userService.loadUser().then(function () {
                        userService.loadItems().then(function () {
                        })
                    });
                    console.log('success');
                    toastr.success('Your profile has been updated.');
                }
                else {
                    toastr.error('Please try again', 'Login or password is invalid');
                    console.log('error');
                }
            });

            if(vm.data != undefined){
                userService.updatePass(id, vm.data).then(function (res) {
                    if (res.success) {
                        userService.loadUser().then(function () {
                            userService.loadItems().then(function () {
                            })
                        });
                        console.log('success');
                    }
                    else {
                        toastr.error('Please try again', 'Login or password is invalid');
                        console.log('error');
                    }
                })
            }
            else {
                console.log('empty');
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
            }

            function isShow(data) {
                return show[data]
            }
        }

    }
}());