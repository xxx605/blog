package com.pojo;

import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class IndexArticle {
        //文章id
        private Long aid;
        //文章内容
        private String a_context;
        //文章标题
        private String a_title;
        //文章图片路径
        private String a_path;
        //文章发表时间
        private String a_time;
        //文章发表人
        private String a_author;
        //文章分类
        private String a_classify;
        //文章浏览人数
        private Integer a_watches;
        //获取纯文本
        private String a_text;
        //
        private String a_nickname;

        //文章评论数量
        private Integer a_commit;
}
