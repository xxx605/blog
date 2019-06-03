package com.utils;


public class pwdUtils {
    public static String decodeValue(String value){
        if(value.equals("")){
            throw new NullPointerException();
        }
        if(value.length()<20){
            throw new NullPointerException();
        }
        String charLength=value.substring(3, 5);//加密后的字符有多少位
        int charLen=Integer.parseInt(charLength,16);//转换成10进制
        int type=Integer.parseInt(value.substring(5, 6));//加密字符的类型（0：数字，1：字符串）
        String valueEnc=value.substring(6, 6+charLen);//16进制字符串
        if(type==0){
            int trueValue=Integer.parseInt(valueEnc,16);
            return String.valueOf(trueValue);
        }else{
            StringBuffer sb=new StringBuffer();
            String[] valueEncArray=valueEnc.split("");
            for(int i=0;i<valueEncArray.length;i+=2){
                int value10=Integer.parseInt(valueEncArray[i]+valueEncArray[i+1],16);//转换成10进制的asc码
                sb.append(String.valueOf((char)value10));//asc码转换成字符
            }
            return sb.toString();
        }
    }



}
