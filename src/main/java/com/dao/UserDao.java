package com.dao;

import com.pojo.IndexArticle;
import com.pojo.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;


@Mapper
public interface UserDao {
    public void insertUser(@Param("user") User user);

    public User selectByUser(@Param("user") User user);

    public User selectById(@Param("id") Integer id);

    public User selectByUsername(@Param("username") String username);

    public User selectByUserInfo(@Param("user") User user);

    //获取最新的8条数据
    public List<IndexArticle> selectIndexArtcile();
    //发表一篇文章
    public void insertArticle(@Param("indexArticle") IndexArticle indexArticle);
    //进入一篇文章(查询）
    public IndexArticle selectArticleByAid(@Param("aid") Long aid);
}
