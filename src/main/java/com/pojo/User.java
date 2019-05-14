package com.pojo;

import lombok.Data;

@Data
public class User {
    //用户id 数据库对应id
    private Integer id;
    //用户名 username 数据库对应username
    private String username;
    //用户密码 password 数据库对应password
    private String password;
    //验证码
    private String code;
    //昵称
    private String nickname;
}
