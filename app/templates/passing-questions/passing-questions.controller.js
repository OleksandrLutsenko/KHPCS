;(function () {
    'use strict';

    angular.module('app')
        .controller('PassingQuestionController', PassingQuestionController);


    PassingQuestionController.$inject = ['userService', '$state', '$mdDialog', 'customers'];

    function PassingQuestionController(userService, $state, $mdDialog, customers) {
        let vm = this;

        let indexActiveSurvey = 0;

        let activeCustomers = customers.getActineCustomers();
        console.log(activeCustomers);

        let items = userService.getItems();

        let activeSurvey = items[indexActiveSurvey];

        // for(let i = 0; i < activeSurvey.blocks.length; i++){
        //     for (let j = 0; j < activeSurvey.blocks[i].length; j++){
        //         console.log(j);
        //     }
        //
        // }

        activeSurvey.blocks.forEach(function(item, i, arr) {
            item.questions.forEach(function (item, i, arr) {
                console.log(item);
            })
        });


    }

})();
