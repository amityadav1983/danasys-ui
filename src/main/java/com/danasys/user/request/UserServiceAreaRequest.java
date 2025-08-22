package com.danasys.user.request;

import lombok.Data;

@Data
public class UserServiceAreaRequest {
	private String addressLine1;
	private UserServiceAreaDeatils userServiceAreaDeatils;
}
