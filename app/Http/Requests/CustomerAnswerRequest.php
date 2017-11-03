<?php

namespace App\Http\Requests;

use App\Customer;
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
            'answer_id' => 'integer|required_without:answer_text',
            'answer_text' => 'string|required_without:answer_id',
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

        if(isset($this->answer_text)){
            $attributes['value'] = $this->answer_text;
        }

        if(isset($this->answer_id)){
            $attributes['answer_id'] = $this->answer_id;
        }

        return $attributes;
    }
}
