package com.danasys.user.request;

import com.danasys.user.enums.AddressTypeEnum;

import lombok.Data;

@Data
public class UserServiceAreaRequest {
	private String addressLine1;
	private AddressTypeEnum addressType;
	private UserServiceAreaDeatils userServiceAreaDeatils;
}
