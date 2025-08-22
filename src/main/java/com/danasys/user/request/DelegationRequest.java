package com.danasys.user.request;

import java.time.LocalDateTime;

import com.danasys.user.enums.UserRoleEnum;

import lombok.Data;

@Data
public class DelegationRequest {
	private Long delegateUserId;
    private UserRoleEnum role;
    private boolean addRole;

}
