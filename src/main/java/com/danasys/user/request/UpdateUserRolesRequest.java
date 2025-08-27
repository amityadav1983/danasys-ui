package com.danasys.user.request;

import java.util.List;

import com.danasys.user.enums.UserRoleEnum;

import lombok.Data;

@Data
public class UpdateUserRolesRequest {
	private List<UserRoleEnum> roles; // list of role names to assign

	public List<UserRoleEnum> getRoles() {
		return roles;
	}

	public void setRoles(List<UserRoleEnum> roles) {
		this.roles = roles;
	}
}
