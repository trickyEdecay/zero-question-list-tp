<?php
namespace app\index\controller;

use app\index\model\User as UserModel;
use think\Session;
use think\Cookie;
use think\Validate;

class User extends Auth
{

    protected $beforeActionList = [
        'isAuthed'=>['only'=>'get_nick_name']
    ];

    public function login(){
        
        
        $email = input('post.email','');
        $password = input('post.password','');
        // step 1. 验证用户的输入
        $rule = [
            'password'  => 'require',
            'email' => 'require|email',
        ];
        $msg = [
            'password.require' => '你没有输入密码哦~QAQ',
            'email.require'     => '你忘记输入邮箱了哦~',
            'email.email'   => '你的邮箱格式有误哦~',
        ];
        $data = [
            'password'  => $password,
            'email' => $email,
        ];
        $validate = new Validate($rule,$msg);
        $result   = $validate->check($data);
        if(!$result){
            return json_encode(
                [
                    'code' => '0001',
                    'msg' => $validate->getError()
                ]
            );
        }

        // step 2. 判断账号存不存在
        $user = new UserModel();
        $result = $user->where('email',$email)->find();
        if(!$result){
            return json_encode(
                [
                    'code' => '0001',
                    'msg' => '账号或密码错误!'
                ]
            );
        }

        // step 3. 验证账号密码正不正确
        $user = $user->where('email',$email)->where('password',md5($password))->find();
        if(!$user){
            // 密码错误
            return json_encode(
                [
                    'code' => '0002',
                    'msg' => '账号或密码错误!'
                ]
            );
        }

        // step 4. 成功登录后将数据写入 session 和 cookie
        Session::set('name',$user->name);
        Session::set('id',$user->id);
        Cookie::set('user',$user->id."::".$user->name,7*24*60*60,'/');
        return json_encode(
            [
                'code' => '0000',
                'msg' => '登录成功!'
            ]
        );
    }

    public function register()
    {
        if(!input('?post.email')){
            return json_encode(
                [
                    'code' => '0001',
                    'msg' => '请求的参数有误'
                ]
            );
        }
        $email = input('post.email');
        $password = input('post.password');
        $nickName = input('post.nickName');

        $user = new UserModel();
        // 判断一下这个用户存不存在
        $result = $user->where('email',$email)->find();
        if($result!==null){
            return json_encode(
                [
                    'code' => '0001',
                    'msg' => '该用户已存在'
                ]
            );
        }
        // 插入用户
        $user->email = $email;
        $user->password = md5($password);
        $user->name = $nickName;
        $result = $user->save();
        if(!$result){
            return json_encode(
                [
                    'code' => '0001',
                    'msg' => '插入数据的时候发生问题'
                ]
            );
        }

        return json_encode(
            [
                'code' => '0000',
                'msg' => '用户创建成功!'
            ]
        );
    }

    public function get_nick_name(){
        return json_encode(
            [
                'code' => '0000',
                'msg' => '获取用户名成功!',
                'data' => Session::get("name")
            ]
        );
    }

    // 处理用户登出的逻辑
    function logout(){
        Session::clear();
        // 清空cookie
        Cookie::delete('user');
        return json_encode(
            [
                'code' => '0000',
                'msg' => '登出成功!'
            ]
        );
    }

}