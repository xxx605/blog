package com.pojo;

import lombok.Data;

@Data
public class Commit {
    private String cpath;
    private Long aid;
    private String c_time;
    private String c_content;
    private String c_nickname;
}
