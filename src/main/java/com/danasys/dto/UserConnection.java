package com.danasys.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UserConnection implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private String displayName;
	private String profileImagePath;
	private Double clearedPoint;
	private Double unclearedPoint;
	private String companyLogo;
	private int totalConnection;
	List<UserConnection> child = new ArrayList<>();
}
