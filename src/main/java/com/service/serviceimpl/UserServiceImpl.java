package com.service.serviceimpl;

import com.dao.UserDao;
import com.pojo.Album;
import com.pojo.Commit;
import com.pojo.IndexArticle;
import com.pojo.User;
import com.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;
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
    public ModelAndView top(ModelAndView mv, String classify) {
        System.out.println(classify);
        List<IndexArticle> indexArticles = userDao.selectIndexArtcileByclassify(classify);
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
    public void insertintoCommit(Commit commit) {
        userDao.insertintoCommit(commit);
    }

    @Override
    public List<Commit> selectAllCommitByaid(Long aid) {
        List<Commit> list=userDao.selectAllCommitByaid(aid);
        return list;
    }

    @Override
    public IndexArticle selectArticleByAid(Long aid) {
        IndexArticle indexArticle = userDao.selectArticleByAid(aid);
        return indexArticle;
    }

    @Override
    public Long selectCounts() {
        Long count=userDao.selectCounts();
        return count;
    }

    @Override
    public Long selectCountsByClassify(String classify) {
        Long count=userDao.selectCountsByclassify(classify);
        return count;
    }

    @Override
    public Model selectCurrPages(Model model, Integer currpage) {
        List<IndexArticle> indexArticles = userDao.selectCurrPages(currpage);
        model.addAttribute("indexArticles",indexArticles);
        return model;
    }

    @Override
    public Model selectCurrPagesByClassify(Model model, String classify, Integer currpage) {
        List<IndexArticle> indexArticles = userDao.selectCurrPagesByClassify(classify,currpage);
        model.addAttribute("indexArticles",indexArticles);
        return model;
    }

    @Override
    public void createAlbum(Album album) {
        userDao.createAlbum(album);
    }

    @Override
    public ModelAndView selectAlbum(ModelAndView mv,String author) {
        List<Album> albums = userDao.selectAlbum(author);
        mv.addObject("albums",albums);
        return mv;
    }

    @Override
    public Model selectModel(Model model, String author) {
        List<Album> albums = userDao.selectAlbum(author);
        model.addAttribute("albums",albums);
        return model;
    }
}
