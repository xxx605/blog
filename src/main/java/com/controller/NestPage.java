package com.controller;


import com.pojo.Album;
import com.pojo.Commit;
import com.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@Controller
public class NestPage {
    @Autowired
    UserService userService;
@RequestMapping("album")
    public ModelAndView album(ModelAndView mv, HttpServletRequest request){
    String loginusername = request.getSession().getAttribute("loginusername")==null? null:request.getSession().getAttribute("loginusername").toString();
    if (loginusername==null){
        mv.setViewName("redirect:login");
        return mv;
    }
    if (loginusername!=null){
        mv=userService.selectAlbum(mv,loginusername);
    }
    mv = userService.similar(mv, request);
    mv.setViewName("album");
    return mv;
}

    @RequestMapping("album2")

    public String album2(Model model,HttpServletRequest request,@RequestBody Album album){
        System.out.println(album);
        String loginusername = request.getSession().getAttribute("loginusername")==null? null:request.getSession().getAttribute("loginusername").toString();
        album.setAlbum_author(loginusername);
        userService.createAlbum(album);
        model=userService.selectModel(model,loginusername);
        return "album :: grid";
    }

    @RequestMapping("person")
    public ModelAndView person(ModelAndView mv,HttpServletRequest request){
        mv = userService.similar(mv, request);
        mv.setViewName("person");
    return mv;
    }

    @RequestMapping("exit")
    public  ModelAndView exit(HttpServletRequest request,ModelAndView mv){
    request.getSession().removeAttribute("loginusername");
    mv.setViewName("redirect:/");
    return mv;
    }

    @RequestMapping("modify")
    public ModelAndView modify(ModelAndView mv,HttpServletRequest request){
    mv=userService.similar(mv,request);
    mv.setViewName("modify");
    return mv;
    }

    @RequestMapping(value = "commit")
    public String commit(@RequestBody Commit commit,Model model){
        userService.insertintoCommit(commit);

        List<Commit> list = userService.selectAllCommitByaid(commit.getAid());

        model.addAttribute("commit",list);

        return "detail :: commitList";
    }
}
