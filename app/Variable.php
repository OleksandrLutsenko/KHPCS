<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Variable extends Model
{
    use SoftDeletes;

    protected $fillable = ['text', 'user_id'];

    public static function getVariablesTextWithTrashed()
    {
        $variables = Variable::withTrashed()->get();
//        $userVariablesArr = array_column($variables->toArray(), 'text');
        foreach ($variables as $variable) {
            if ($variable->trashed()) {
//                $deletedVariableMessage = "<span style='background-color: red'>variable was deleted</span>";
                $deletedVariableMessage = " ";
                $userVariables[$variable->id] = $deletedVariableMessage;
            } else {
                $userVariables[$variable->id] = $variable->text;
            }
        }
        if (isset($userVariables)) {
            return $userVariables;
        }
//        return $userVariables;
    }

    public static function boot()
    {
        parent::boot();

        static::deleting(function ($variable) {
            $variable->update([
//                $variable->text = '<span style="background-color: red">variable was deleted</span>'
                $variable->text = ' '
            ]);
        });
    }
}