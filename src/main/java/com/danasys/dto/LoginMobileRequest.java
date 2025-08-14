package com.danasys.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class LoginMobileRequest {

	private String mobileNumber;
	private int otp;
}
