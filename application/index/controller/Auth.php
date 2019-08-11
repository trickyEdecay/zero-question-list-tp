<?php
namespace app\index\controller;
use think\Session;
use think\Cookie;
use think\Controller;

class Auth extends Controller{
    protected function isAuthed(){
        if(Cookie::has('user')){
            // 用户id::用户的姓名
            Session::set("id",explode("::",Cookie::get('user'))[0]);
            Session::set("name",explode("::",Cookie::get('user'))[1]);
        }
        if(!Session::has('name')){
            die(json_encode(
                [
                    'code' => '0001',
                    'msg' => '您还没有登录!'
                ]
            ));
        }
        
    }
}