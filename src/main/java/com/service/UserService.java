package com.service;

import com.pojo.IndexArticle;
import com.pojo.User;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

public interface UserService {
    public String userLogin(User user,Object code);
    public String userRegister(User user);
    public User getUserInfo(String loginUsername);
    public ModelAndView similar(ModelAndView mv, HttpServletRequest request);
    //获取最新的8条数据
    public ModelAndView top(ModelAndView mv);
    //判断是否已经登陆，若没有登录不能发表
    public String issue(HttpServletRequest request, IndexArticle indexArticle);
    //查询一篇文章
    public IndexArticle selectArticleByAid(Long aid);
}
