package com.danasys.user.request;

import lombok.Data;

@Data
public class RegisterUserRequest {

	private String email;
	
	private String mobileNumber;

	private String password;
	
	private String fullName;
	
	 private String OTP;

}
