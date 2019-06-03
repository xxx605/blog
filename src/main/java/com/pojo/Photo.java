package com.pojo;

import lombok.Data;

@Data
public class Photo {
    //相片所属相册
    private Long photo_id;
    //相片路径
    private String photo_path;
    //相片发表时间
    private String photo_time;
}
