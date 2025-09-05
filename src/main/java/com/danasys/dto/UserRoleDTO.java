package com.danasys.dto;

import java.io.Serializable;
import java.util.Set;

import com.danasys.user.enums.UserRoleEnum;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserRoleDTO implements Serializable  {

	private static final long serialVersionUID = 1L;
	
	private Long userId;
	private String username;
	private Set<UserRoleEnum> roles;

}
