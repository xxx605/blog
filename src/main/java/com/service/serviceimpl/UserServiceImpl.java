package com.service.serviceimpl;

import com.dao.UserDao;
import com.pojo.IndexArticle;
import com.pojo.User;
import com.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Service
public class UserServiceImpl implements UserService {
    @Autowired
    UserDao userDao;
    @Override
    public String userLogin(User user,Object code) {
        String logincode=user.getCode();
        String username = user.getUsername();
        //判断验证码，1表示验证码有误，2表示用户名有误，3表示密码有误，4表示登录成功
        if(!logincode.equals(code)){
                return "1";
        }else {
            User selectByUsername = userDao.selectByUsername(username);
            if (selectByUsername == null) {
                return "2";
            } else {
                User selectByUser = userDao.selectByUser(user);
                if (selectByUser==null)return "3";
                Integer id = selectByUser.getId();
            }
        }
        return "4";
    }

    @Override
    public String userRegister(User user) {

        return null;
    }

    @Override
    public User getUserInfo(String loginUsername) {
        User user = userDao.selectByUsername(loginUsername);
        return user;
    }

    @Override
    public ModelAndView similar(ModelAndView mv, HttpServletRequest request) {
        HttpSession session = request.getSession();
        String loginusername = String.valueOf(session.getAttribute("loginusername"));
        User userInfo = null;
        if (loginusername != null) {
            userInfo =getUserInfo(loginusername);
            mv.addObject("userinfo", userInfo);
        } else {
            mv.addObject("userinfo", userInfo);
        }
        return mv;
    }

    @Override
    public ModelAndView top(ModelAndView mv) {
        List<IndexArticle> indexArticles = userDao.selectIndexArtcile();
        System.out.println(indexArticles);
        mv.addObject("indexArticles",indexArticles);
        return mv;
    }

    @Override
    public String issue(HttpServletRequest request,IndexArticle indexArticle) {
        HttpSession session = request.getSession();
        String loginusername = request.getSession().getAttribute("loginusername")==null? null:request.getSession().getAttribute("loginusername").toString();
        if (loginusername!=null&&loginusername!="") {
            System.out.println(indexArticle);
            userDao.insertArticle(indexArticle);
           return "1";
        }else {
            System.out.println(loginusername);
            return "2";
        }
    }

    @Override
    public IndexArticle selectArticleByAid(Long aid) {
        IndexArticle indexArticle = userDao.selectArticleByAid(aid);
        return indexArticle;
    }
}
