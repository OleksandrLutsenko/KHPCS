<?php

/**
 * Created by PhpStorm.
 * User: dmytro_mac
 * Date: 30.10.17
 * Time: 12:46
 */
namespace App\Transformers;

class Json
{
    public static function response($data = null, $message = null)
    {
        return [
            'data'    => $data,
            'message' => $message,
        ];
    }
}