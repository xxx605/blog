package com.pojo;

import lombok.Data;

import java.util.List;

@Data
public class Album {
    //相册id
    private Long album_id;
    //相册名称
    private String album_title;
    //相册描述
    private String album_content;
    //相册创建时间
    private String album_time;
    //相册创建人
    private String album_author;
    //相册的相片
    private List<Photo> photos;
}
