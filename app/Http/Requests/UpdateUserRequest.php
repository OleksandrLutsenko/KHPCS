<?php
/**
 * Created by PhpStorm.
 * User: dmytro_mac
 * Date: 19.12.17
 * Time: 14:16
 */

namespace App\Http\Requests;


use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
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
            'name' => 'string|max:255',
            'email' => 'string|email|max:255|unique:users',
            'password' => 'string|min:6|confirmed'
        ];
    }
}