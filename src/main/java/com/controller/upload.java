package com.controller;


import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

@RestController
@Slf4j
public class upload {
    @RequestMapping("/upload")
    public String upload(@RequestParam("filename") MultipartFile[] files, HttpServletRequest request) throws Exception {

        System.out.println(request.getParameter("selectalbum"));

        //获取跟目录
        File path = new File(ResourceUtils.getURL("classpath:").getPath());
        if(!path.exists()) path = new File("");
        System.out.println("path:"+path.getAbsolutePath());

//如果上传目录为/static/images/upload/，则可以如下获取：
        File upload = new File(path.getAbsolutePath(),"upload/file/");
        if(!upload.exists()) upload.mkdirs();

//在开发测试模式时，得到的地址为：{项目跟目录}/target/static/images/upload/
//在打包成jar正式发布时，得到的地址为：{发布jar包目录}/static/images/upload/




        String filename=null;
        String path1=upload.getAbsolutePath();
        for (MultipartFile file : files) {
            if (file == null) {
                return "你没有选择文件!";
            }
            filename = file.getOriginalFilename();
            final SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd.HH@mm@ss,SSSS");
            final String format1 = format.format(new Date());
            filename= UUID.randomUUID()+filename;
            file.transferTo(new File(path1+File.separator+format1+filename));
        }
        return "上传成功！".concat(filename);
    }
}
