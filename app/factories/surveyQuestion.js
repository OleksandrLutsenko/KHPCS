;(function () {
    angular
        .module('factory.surveyQuestion', [])
        .factory('surveyQuestion', surveyQuestion);

    surveyQuestion.$inject = ['surveyService'];

    function surveyQuestion(surveyService) {
        let model = {};

        model.createOrUpdateQuestion        = createOrUpdateQuestion;
        model.createOrUpdateOrDeleteAnswer  = createOrUpdateOrDeleteAnswer;

        return model;

        function createOrUpdateQuestion(idQuestion, indexQuestion, idBlock, data, items) {
            let dataForSend = {
                title: data.title,
                identifier: data.identifier,
                type: data.type
            };
            if(dataForSend.type == 2){
                dataForSend.next_question = data.next_question;
                if (dataForSend.next_question == 'last') {
                    dataForSend.last = 1;
                    delete dataForSend.next_question;
                }
                else {
                    dataForSend.last = 0
                }
            }
            else {
                dataForSend.last = 0
            }

            if(typeof idQuestion == 'undefined'){
                return surveyService.createQuestion(idBlock, dataForSend).then(function (res) {
                    if(res.success){
                        items.push(res.data.question);
                        return {type: res.data.question.type}
                    }
                });
            }
            else {
                return surveyService.updateQuestion(idQuestion, dataForSend).then(function (res) {
                    if(res.success){
                        items.splice(indexQuestion, 1, res.data.question);
                        return {type: res.data.question.type}
                    }
                });
            }
        }

        function createOrUpdateOrDeleteAnswer(answers, items, indexQuestion, idQuestion) {
            answers.forEach(function (item, indexAnswer) {
                if(item.forDelete){
                    deleteAnswer(item, indexAnswer)
                }
                else {
                    let data = {
                        answer_text: item.answer_text
                    };
                    if(item.naxt_question == 'last'){
                        data.hasLast = 1
                    }
                    else {
                        data.hasLast = 0;
                        if(item.next_question != null){
                            data.next_question = item.next_question
                        }
                    }

                    if(item.hasExtra === true){
                        data.hasExtra = 1
                    }
                    else {
                        data.hasExtra = 0
                    }

                    if(typeof data.answer_text != 'undefined' && data.answer_text != ''){
                        if(typeof item.id == 'undefined'){
                            createAnswer(data);
                        }
                        else{
                            updateAnswer(data, item.id, indexAnswer);
                        }
                    }
                    else {
                        console.log('Iinvalid data');
                    }
                }


                function deleteAnswer(answer, indexAnswer) {
                    surveyService.deleteAnswer(answer.id).then(function (res) {
                        if (res.success) {
                            items[indexQuestion].answers.splice(indexAnswer, 1);
                        }
                    })
                }

                function createAnswer(data) {
                    surveyService.createAnswer(idQuestion, data).then(function (res) {
                        if (res.success) {
                            items[indexQuestion].answers.push(res.data.answer);
                        }
                    })
                }

                function updateAnswer(data, idAnswer, indexAnswer) {
                    surveyService.updateAnswer(idAnswer, data).then(function (res) {
                        if(res.success) {
                            items[indexQuestion].answers.splice(indexAnswer, 1, res.data.answer);
                        }
                    })
                }
            });
        }
    }

})();