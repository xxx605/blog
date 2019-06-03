package com.service;

import com.pojo.Album;
import com.pojo.Commit;
import com.pojo.IndexArticle;
import com.pojo.User;
import org.springframework.ui.Model;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

public interface UserService {
    public String userLogin(User user,Object code);
    public String userRegister(User user);
    public User getUserInfo(String loginUsername);
    public ModelAndView similar(ModelAndView mv, HttpServletRequest request);
    //获取最新的8条数据
    public ModelAndView top(ModelAndView mv);
    //获取分类的最新8条
    public ModelAndView top(ModelAndView mv,String classify);
    //判断是否已经登陆，若没有登录不能发表
    public String issue(HttpServletRequest request, IndexArticle indexArticle);
    //提交留言
    public void insertintoCommit(Commit commit);
    public List<Commit> selectAllCommitByaid(Long aid);
    //查询一篇文章
    public IndexArticle selectArticleByAid(Long aid);
    //查询总数
    public Long selectCounts();
    // 通过分类查询总数
    public Long selectCountsByClassify(String classify);
    //通过页码查询
    public Model selectCurrPages(Model model, Integer currpage);
    //通过分类页面查询
    public Model selectCurrPagesByClassify(Model model,String classify,Integer currpage);
    //创建相册
    public void createAlbum(Album album);
    //查询相册内容
    public ModelAndView selectAlbum(ModelAndView mv,String author);
    //查询相册内容(局部刷新)
    public Model selectModel(Model model,String author);
}
