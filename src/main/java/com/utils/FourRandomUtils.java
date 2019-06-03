package com.utils;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public enum  FourRandomUtils {
    FOUR_RANDOM_UTILS;
    List<String> str;
    public  String getFourRandom(){
        String str="";

        for (int i=0;i<4;i++){
            Random random = new Random();
            int r=random.nextInt(123);
            if ((r>47&&r<58)||(r>64&&r<91)||(r>96&&r<123)){
                str+=(char)r;
            }else {
                i--;
            }
        }
        return str;
    }

    public List<String> getFour(){
        if(str==null)
        str=new ArrayList<>();
        for (int i=0;i<99999;i++){
            str.add(getFourRandom());
        }
        return str;
    }
}
