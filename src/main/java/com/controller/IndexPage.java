package com.controller;

import com.baidu.ueditor.ActionEnter;
import com.dao.UserDao;
import com.pojo.Commit;
import com.pojo.IndexArticle;
import com.pojo.User;
import com.service.UserService;
import com.utils.pwdUtils;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class IndexPage {
    @Autowired
UserService userService;
    @RequestMapping("/a")
    private String showPage(){

        return "indexa";
    }

    @RequestMapping(value="config")
    public void config(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        String rootPath = ResourceUtils.getURL("classpath:").getPath();
        File file = new File(rootPath,"static");
        rootPath= file.getAbsolutePath();
        try {
            String exec = new ActionEnter(request, rootPath).exec();
            PrintWriter writer = response.getWriter();
            System.out.println(writer);
            writer.write(exec);
            writer.flush();
            writer.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }


    @RequestMapping("/")
    public ModelAndView index(ModelAndView mv,HttpServletRequest request){
        Long counts = userService.selectCounts();
        mv.addObject("count",counts);
        mv = userService.similar(mv, request);
        mv=userService.top(mv);
        request.getSession().setAttribute("pageclassify",null);
       mv.setViewName("index");
        return mv;
    }

    @RequestMapping("/page")
    public  String page(Model model, HttpServletRequest request){
        String classify = (String) request.getSession().getAttribute("pageclassify");
            Integer curr=request.getParameter("curr")==null?null: Integer.valueOf(request.getParameter("curr"));
            if (classify==null) {
                System.out.println(classify);
                if (curr != null) {
                    curr = (curr - 1) * 8;
                    model = userService.selectCurrPages(model, curr);
                } else {
                    model = userService.selectCurrPages(model, 0);
                }
            }else {
                if (curr!=null){
                    curr = (curr - 1) * 8;
                    model = userService.selectCurrPagesByClassify(model,classify,curr);

                }else {
                    model = userService.selectCurrPagesByClassify(model,null ,0);
                }
            }
        return "common/indexPage :: leftArticle";
    }


    @RequestMapping("article")
    public ModelAndView article(ModelAndView mv,HttpServletRequest request) throws UnsupportedEncodingException {

        mv = userService.similar(mv, request);
        String classify = request.getParameter("classify")==null?null:request.getParameter("classify").toString().trim();
        System.out.println("classify的值:"+classify);
        if(classify!=null){
            mv=userService.top(mv,classify);
            Long counts=userService.selectCountsByClassify(classify);
            mv.addObject("count",counts);
        }else {
            mv=userService.top(mv);
            Long counts = userService.selectCounts();
            mv.addObject("count",counts);
        }
        mv.setViewName("article");
        request.getSession().setAttribute("pageclassify",classify);
        return mv;
    }

    @RequestMapping(value = "detail")
    public ModelAndView detail(ModelAndView mv,HttpServletRequest request){
        Long aid=request.getParameter("aid")==null?null: Long.valueOf(pwdUtils.decodeValue(request.getParameter("aid")));
        System.out.println(aid);
        if(aid!=null){
            IndexArticle indexArticle = userService.selectArticleByAid(aid);
            mv.addObject("article",indexArticle);
            mv.addObject("aid",aid);

            mv.setViewName("detail");

        }else {
            mv.addObject("article",null);
        }
        mv = userService.similar(mv, request);
        List<Commit> list = userService.selectAllCommitByaid(aid);
        System.out.println(list);
        mv.addObject("commit",list);
        return mv;
    }


    @RequestMapping("report")
    public ModelAndView report(ModelAndView mv,HttpServletRequest request){
        mv = userService.similar(mv, request);
        mv.setViewName("report");
        return mv;
    }

    @RequestMapping(value = "logincode",method = RequestMethod.POST)
    @ResponseBody
    public Map<String,Object> login( @RequestBody User user,HttpServletRequest request) throws Exception {
        HttpSession session = request.getSession();
        Map<String,Object> map=new HashMap<String,Object>();
        String login = userService.userLogin(user,session .getAttribute("checkcode_session"));
        String loginusername = user.getUsername();
        session.setAttribute("loginusername",loginusername);
        map.put("info",login);
        return map;
    }

    @RequestMapping(value = "issue",method = RequestMethod.POST)
    @ResponseBody
    public Map<String,Object> issue(@RequestBody IndexArticle indexArticle,HttpServletRequest request){
        Map<String,Object> map=new HashMap<String,Object>();
        String loginusername = request.getSession().getAttribute("loginusername")==null? null:request.getSession().getAttribute("loginusername").toString();
        indexArticle.setA_author(loginusername);
        String issue=userService.issue(request,indexArticle);
       map.put("issue",issue);
        return map;
    }


    @RequestMapping("reg")
    public String reg(){
        return "login/reg";
    }
    @RequestMapping("login")
    public String login1(){
        return "login/login";
    }




}
