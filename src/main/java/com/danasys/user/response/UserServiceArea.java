package com.danasys.user.response;

import com.danasys.dto.StatusEnum;
import com.danasys.user.enums.*;

import lombok.Data;

@Data
public class UserServiceArea {
	private Long id;
	private String fullAddress;
	private int pinCode;
	private StatusEnum status;
	private String district;
	private String state;
	
}
