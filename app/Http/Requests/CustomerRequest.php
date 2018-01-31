<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class CustomerRequest extends FormRequest
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
            'name' => 'required|min:2|max:30',
            'surname' => 'required|min:2|max:30',
            'classification' => 'max:30',
        ];
    }

    public function getCustomerAttribute()
    {
        if (Auth::user()->isAdmin()) {
            $attributes['user_id'] = null;
            $attributes['company_id'] = $this->company_id;
        } else {
            $attributes['user_id'] = Auth::user()->id;
            $attributes['company_id'] = Auth::user()->company_id;
        }
        $attributes['name'] = $this->name;
        $attributes['surname'] = $this->surname;
        $attributes['classification'] = $this->classification;
        return $attributes;
    }
}
