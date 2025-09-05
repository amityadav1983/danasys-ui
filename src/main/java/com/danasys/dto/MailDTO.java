package com.danasys.dto;

import java.util.Properties;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class MailDTO {
	String username;
    String password;
    String from;
    String[] to;
    String subject;
    String body;
    Properties prop;
    int otp;
}
