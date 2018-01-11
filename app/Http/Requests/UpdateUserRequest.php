<?php
/**
 * Created by PhpStorm.
 * User: dmytro_mac
 * Date: 19.12.17
 * Time: 14:16
 */

namespace App\Http\Requests;


use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

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
        if ($this['email'] == Auth::user()->email){
            return [
                'name' => 'string|max:255',
                'email' => 'string|email|max:255',
                'password' => 'string|min:6|confirmed'
            ];
        } else {
            return [
                'name' => 'string|max:255',
                'email' => 'string|email|max:255|unique:users',
                'password' => 'string|min:6|confirmed'
            ];
        }
    }

    protected function checkCurrentPassword($user) {
        return Hash::check($this['current_password'], $user->password);
    }

    public function changePassword($user)
    {
        if ($this->checkCurrentPassword($user)){
            $user->update([
                'password' => bcrypt($this['password']
                )]);
            return response('Password was changed', 201);
        } else {
            return response('Current password is wrong', 500);
        }
    }

    public function changeNameAndEmail($user)
    {
        $user->update([
            'name' => $this['name'],
            'email' => $this['email']
        ]);
        return response(['user' => $user], 201);
    }

    public function changeCompany($user)
    {
        $user->update([
            'company_id' => $this['company_id']
        ]);
        return response(['user' => $user], 201);
    }
}