;(function () {
    'use strict';

    angular.module('app')
        .controller('ContractEditorController', ContractEditorController);



    ContractEditorController.$inject = ['userService', 'survey', 'customers'];

    function ContractEditorController(userService, survey, customers) {
        let vm = this;
        console.log('contract-editor controller start');

        vm.items = userService.getItems();
        console.log(vm.items);

        let activeSurveyID;
        let activeSurveyName;
        let activeBlockId;

        CKEDITOR.replace('CKeditorArea');
        vm.surveyMenuInContractEditor = true;
        vm.contractEditor = false;

        //////////////////////////Поблочный просмотр вопросов//////////////////////////
        vm.showQuestionsInBlock = function (idCurrentBlock) {
            if (activeBlockId === idCurrentBlock){
                activeBlockId = undefined;
            } else  {
                activeBlockId = idCurrentBlock;
            }
        };

        vm.showQuestions = function (id) {
            if (activeBlockId === id){
                return true;
            } else {
                return false;
            }
        };
        ///////////////////////////////////////////////////////////////////////////////


        ///////////////////////////////////////////////////////////////////////////////

        vm.setActiveSurvey = function (id, index, name) {
            vm.surveyMenuInContractEditor = false;
            vm.contractEditor = true;
            vm.activeSurvey = vm.items[index];
            activeSurveyID = id;
            activeSurveyName = name;
            console.log(vm.activeSurvey);
        };

        vm.reelectActiveSurvey = function () {
            vm.surveyMenuInContractEditor = true;
            vm.contractEditor = false;
        };

        vm.pasteTitle = function (data) {
            CKEDITOR.instances['CKeditorArea'].insertText(data);
        };

        vm.pasteVariability = function (data, id) {
            CKEDITOR.instances['CKeditorArea'].insertText('{!!$contractAnswers[' + id + ']!!}');
        };


        //////////////////////////////Замена текста////////////////////////////////////
        vm.testReplace = function () {
            let tmpTextData = CKEDITOR.instances.CKeditorArea.getData();
            CKEDITOR.instances.CKeditorArea.setData(tmpTextData.replace(/1/g, '2'));
            console.log(tmpTextData);
        };
        ///////////////////////////////////////////////////////////////////////////////

        /////////////////////////Работа с шаблонами////////////////////////////////////
        vm.postTemplate = function () {
            let tmpTemlate = {
                "title": 'Contract template for the survey "' + activeSurveyName + '"',
                "body": "<!doctype html><html lang=\"en\"><head><meta charset=\"UTF-8\"><meta name=\"viewport\"content=\"width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0\"><meta http-equiv=\"X-UA-Compatible\" content=\"ie=edge\"><title>Document</title></head><body>" + CKEDITOR.instances['CKeditorArea'].getData() + "</body></html>",
                "survey_id": activeSurveyID
            };
            // console.log(tmpTemlate);
            // console.log(tmpTemlate.title);
            // console.log(tmpTemlate.survey_id);

            userService.createTemplate(tmpTemlate).then(function (res) {
                console.log(res);
            });
        };

        vm.loadTemplates = function () {
            userService.loadAllTemplates().then(function (res) {
                console.log(res, 'Шаблоны');
            });
        };

        vm.removeTemplate = function () {
            let id = 4; //ID шаблона который мы хотим удалить
            userService.removeTemplate(id).then(function (res) {
                console.log(res);
            });
        };

        vm.updateTemplate = function () {
            let id = 5; //ID шаблона который мы хотим перезаписать
            let data = {
                "title": 'Contract template for the survey "' + activeSurveyName + '"',
                "body": "<!doctype html><html lang=\"en\"><head><meta charset=\"UTF-8\"><meta name=\"viewport\"content=\"width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0\"><meta http-equiv=\"X-UA-Compatible\" content=\"ie=edge\"><title>Document</title></head><body>" + CKEDITOR.instances['CKeditorArea'].getData() + "</body></html>",
                "survey_id": activeSurveyID
            };
            userService.updateTemplate(id, data).then(function (res) {
                console.log(res);
            });
        };

        ///////////////////////////////////////////////////////////////////////////////


        /////////////Возможно пригодится если будет больше одного шаблона//////////////
        vm.tmpTemplate = CKEDITOR.instances.CKeditorArea.setData(''); //сюда прикрутить шаблон с сервера
        let some = 'переменная';
        vm.choseTemplate = function () {
            CKEDITOR.instances.CKeditorArea.setData('<p>Test insert is ready0 ' + some + '</p>\n' +
                '\n' +
                '<p>Test insert is ready1</p>\n' +
                '\n' +
                '<p>Test insert is ready2</p>\n' +
                '\n' +
                '<p>Test insert is ready3</p>');
        };
        // vm.choseTemplate = CKEDITOR.instances.CKeditorArea.setData('<p>Template is ready</p>');
        //////////////////////////////////////////////////////////////////////////////


        ///////////Впринцыпе ненужная фигня :) , но пускай пока полежит////////////////
        vm.getAnswer = function () {
            let id = {
                customer: customers.getActiveCustomers(),
                survey: userService.getItems()[0].id
            };

            let customerAnswer = userService.getCustomerAnswer(id).then(function (res) {
                vm.tmpAnswerArr = res.data;
                console.log(vm.tmpAnswerArr, 'vm.tmpAnswerArr');

                CKEDITOR.instances['CKeditorArea'].insertText(res.data.customerAnswers[0].customerAnswers[0].value);
            });
            console.log(id);
            console.log(customerAnswer);

        };
        ///////////////////////////////////////////////////////////////////////////////


        ///////////////////////////////////Напоминание/////////////////////////////////
        function hint() {
            console.log(CKEDITOR.instances['CKeditorArea'].insertText(), 'Вставить текст в редактор');
            console.log(CKEDITOR.instances['CKeditorArea'].getData(),    'Получить содержимое редактора');
            console.log(CKEDITOR.instances['CKeditorArea'].setData(),    'заменить содержимое редактора');
        }
        ///////////////////////////////////////////////////////////////////////////////

        vm.test = function (data) {
            console.log(data);
        };
    }
})();