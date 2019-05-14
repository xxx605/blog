package com.controller;

import com.baidu.ueditor.ActionEnter;
import com.pojo.IndexArticle;
import com.pojo.User;
import com.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Controller;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.*;
import java.util.HashMap;
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
//        String rootPath = request.getSession().getServletContext().getRealPath("/");
        String rootPath = ResourceUtils.getURL("classpath:").getPath();
        File file = new File(rootPath,"static");
        rootPath= file.getAbsolutePath();
        System.out.println("大苏打"+rootPath);
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
        mv = userService.similar(mv, request);
       mv=userService.top(mv);
       mv.setViewName("index");
        return mv;
    }

    @RequestMapping("article")
    public ModelAndView article(ModelAndView mv,HttpServletRequest request){
       mv = userService.similar(mv, request);
        mv=userService.top(mv);
        mv.setViewName("article");
        return mv;
    }

    @RequestMapping(value = "detail")
    public ModelAndView detail(ModelAndView mv,HttpServletRequest request){
        Long aid=request.getParameter("aid")==null?null:Long.valueOf(request.getParameter("aid"));
        System.out.println(aid);
        if(aid!=null){
            IndexArticle indexArticle = userService.selectArticleByAid(aid);
            mv.addObject("article",indexArticle);
            System.out.println(indexArticle);
        }else {
            mv.addObject("article",null);
        }
        mv = userService.similar(mv, request);
        mv.setViewName("detail");
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
