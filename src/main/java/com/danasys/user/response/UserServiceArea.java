package com.danasys.user.response;

import java.io.Serializable;
import java.util.List;

import com.danasys.dto.StatusEnum;
import com.danasys.user.enums.*;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UserServiceArea implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private Long id;
	private String fullAddress;
	private int pinCode;
	private StatusEnum status;
	private String district;
	private String state;
	
}
