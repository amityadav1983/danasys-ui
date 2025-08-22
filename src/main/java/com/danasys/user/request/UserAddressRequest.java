package com.danasys.user.request;

import com.danasys.user.enums.AddressTypeEnum;

import lombok.Data;

@Data
public class UserAddressRequest {
	private AddressTypeEnum type;
	private String address;
	private UserServiceAreaRequest serviceArea;
	private boolean isDefault;
	
}
