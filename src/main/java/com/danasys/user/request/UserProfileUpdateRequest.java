package com.danasys.user.request;

import lombok.Data;

@Data
public class UserProfileUpdateRequest {
    private String ContactNumber;
	private String email;
	private String fullName;
	private String referralCode;

	
}
