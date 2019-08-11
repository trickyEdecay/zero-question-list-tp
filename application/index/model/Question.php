<?php
namespace app\index\model;

use think\Model;

class Question extends Model
{
    protected $table = 'questions';   

    public function user(){
        return $this->belongsTo('User','user_id');
    }
}