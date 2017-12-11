<?php

namespace App\Http\Requests;

use App\Answer;
use App\Customer;
use App\Question;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Class CustomerAnswerRequest
 *
 * @property string $answer_text
 * @property int $answer_id
 *
 * @package App\Http\Requests
 */
class CustomerAnswerRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
//            'answer_id' => 'integer|required_without:answer_text',
//            'answer_text' => 'string|required_without:answer_id',
//            'value' => 'max:50'
        ];
    }

    /**
     * @param Customer $customer
     * @return array
     */
    public function getAnswerAttributes(Customer $customer){
        $attributes =  array_merge($this->all(), [
            'customer_id' => $customer->id,
        ]);


        /** It means that value can't be filled by user if it is the radio type question **/
        if(isset($this->answer_text)){
            if(!$this->question->hasRadioAnswer()){
                $attributes['answer_id'] = null;
                $attributes['value'] = $this->answer_text;
            }
            else{
                die;
            }
        }

        /** It means that the user can't use answer_id from another questions to answer **/
        if(isset($this->answer_id)){
            $answer = Answer::find($this->answer_id);
            if($this->question->id !== $answer->question_id) {
                die;
            }
            $attributes['answer_id'] = $this->answer_id;
            $attributes['value'] = $answer->answer_text;
        }

        return $attributes;
    }
}
