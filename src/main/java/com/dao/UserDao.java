package com.dao;

import com.pojo.Album;
import com.pojo.Commit;
import com.pojo.IndexArticle;
import com.pojo.User;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

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
    //获取分类的最新8条数据
    public List<IndexArticle> selectIndexArtcileByclassify(@Param("classify") String classify);
    //发表一篇文章
    public void insertArticle(@Param("indexArticle") IndexArticle indexArticle);
    //进入一篇文章(查询）
    public IndexArticle selectArticleByAid(@Param("aid") Long aid);

    //提交留言
    public void insertintoCommit(@Param("commit") Commit commit);
    @Select("select * from u_commit where aid=#{aid}")
    public List<Commit> selectAllCommitByaid(Long aid);
    //查询总数
    @Select("SELECT COUNT(aid) count FROM u_article;")
    public Long selectCounts();

    //查询分页总数
    @Select("SELECT COUNT(aid) count FROM u_article where a_classify=#{classify};")
    public Long selectCountsByclassify(String classify);

    //查询当前页的数据
    @Select("select * from u_article ORDER BY aid DESC LIMIT #{currage},8")
    public List<IndexArticle> selectCurrPages(Integer currpage);
    //通过分类查询分页数据
    @Select("select * from u_article where a_classify=#{classify} ORDER BY aid DESC LIMIT #{currpage},8; ")
    public List<IndexArticle> selectCurrPagesByClassify(String classify,Integer currpage);


    //创建相册
    public void createAlbum(@Param("albums") Album album);
    //查询相册
    @Select("select * from u_album where album_author=#{author}")
    public List<Album> selectAlbum(@Param("author") String author);
}
