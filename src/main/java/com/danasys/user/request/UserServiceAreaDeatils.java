package com.danasys.user.request;

import lombok.Data;

@Data
public class UserServiceAreaDeatils {
	private Long id;
	private String fullAddress;
	private String district;
	private String state;
	private int pinCode;
}
