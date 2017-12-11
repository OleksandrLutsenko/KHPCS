;(function () {
    angular
        .module('factory.surveyQuestion', [])
        .factory('surveyQuestion', surveyQuestion);

    surveyQuestion.$inject = ['questionService'];

    function surveyQuestion(questionService) {
        let model = {};

        model.createOrUpdateQuestion        = createOrUpdateQuestion;
        model.createOrUpdateOrDeleteAnswer  = createOrUpdateOrDeleteAnswer;

        return model;

        function createOrUpdateQuestion(idQuestion, indexQuestion, idBlock, data, items) {
            let dataForSend = {
                title: data.title,
                type: data.type,
            };

            if(data.hidden){
                dataForSend.identifier = data.identifier;
                dataForSend.hidden = true;
            }
            else {
                dataForSend.identifier = null;
                dataForSend.hidden = false;
            }

            if(typeof idQuestion == 'undefined'){
                return questionService.createQuestion(idBlock, dataForSend).then(function (res) {
                    if(res.success){
                        items.push(res.data.question);
                        console.log('res', res)
                        return {
                            type: res.data.question.type,
                            hidden: res.data.question.hidden,
                            idQuestion: res.data.question.id
                        }
                    }
                });
            }
            else {
                return questionService.updateQuestion(idQuestion, dataForSend).then(function (res) {
                    if(res.success){
                        items.splice(indexQuestion, 1, res.data.question);
                        return {
                            type: res.data.question.type,
                            hidden: res.data.question.hidden
                        }
                    }
                });
            }
        }

        function createOrUpdateOrDeleteAnswer(answers, items, indexQuestion, idQuestion, hidden, idQuestionForCreate) {

            let couterDelete = 0;

            answers.forEach(function (item, indexAnswer) {
                if(item.forDelete){
                    deleteAnswer(item.id, indexAnswer)
                }
                else {
                    let data = {
                        answer_text: item.answer_text
                    };

                    if(hidden == true){
                        data.hasHidden = false;
                    }
                    else {
                        if(item.hasHidden){
                            data.hasHidden = item.hasHidden;
                            data.next_question = item.next_question;
                        }
                        else {
                            data.hasHidden = false;
                            data.next_question = null;
                        }
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
                        console.log('Invalid data');
                    }
                }


                function deleteAnswer(idAnswer, indexAnswer) {
                    questionService.deleteAnswer(idAnswer).then(function (res) {
                        if (res.success) {
                            items[indexQuestion].answers.splice(indexAnswer - couterDelete, 1);
                        }
                    });
                    couterDelete++;
                }

                function createAnswer(data) {
                    let id;
                    if(indexQuestion == undefined){
                       id = idQuestionForCreate;
                    }
                    else {
                        id = indexQuestion;
                    }
                    console.log(idQuestionForCreate, 'idQuestionForCreate');
                    questionService.createAnswer(id, data).then(function (res) {
                        if (res.success) {
                            items[items.length - 1].answers.push(res.data.answer);
                        }
                    })
                }

                function updateAnswer(data, idAnswer, indexAnswer) {
                    questionService.updateAnswer(idAnswer, data).then(function (res) {
                        if(res.success) {
                            items[indexQuestion].answers.splice(indexAnswer - couterDelete, 1, res.data.answer);
                        }
                    })
                }
            });
        }
    }

})();