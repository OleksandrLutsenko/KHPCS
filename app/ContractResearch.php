<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ContractResearch extends Model
{
    use SoftDeletes;

    public function images(){
        return $this->hasMany(Image::class);
    }

    public function contract(){
        return $this->hasOne(Contract::class);
    }

    public static function boot()
    {
        parent::boot();

        static::creating(function ($table) {

            $table->user_id = Auth::user()->id;
        });

        static::deleting(function ($contractResearch) {

            $images = $contractResearch->images;
            foreach ($images as $image){
                $fileUri = $image->link;
                File::delete('../'.$fileUri);
                $image->delete();
            }
        });
    }
}
