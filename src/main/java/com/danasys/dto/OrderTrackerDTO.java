package com.danasys.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.danasys.user.enums.UserRoleEnum;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class OrderTrackerDTO implements Serializable  {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private UserRoleEnum role;
	private String actor;
	private String action;
	private Date actionOn;
	private String comments;
	private List<OrderTrackerDTO> tracker = new ArrayList<>();
}
