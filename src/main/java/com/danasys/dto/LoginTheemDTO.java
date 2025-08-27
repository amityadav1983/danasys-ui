package com.danasys.dto;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class LoginTheemDTO implements Serializable {
	private static final long serialVersionUID = 1L;
	
	private String backGroundImageURL;
	
	private String compenyLogo;
}
