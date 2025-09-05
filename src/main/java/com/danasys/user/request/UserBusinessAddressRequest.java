package com.danasys.user.request;

import lombok.Data;

@Data
public class UserBusinessAddressRequest {
    private Long id;
    private boolean active;
	private BusinesBankAccountRequest bankAccount;
	private UserServiceAreaRequest userServiceAreaDeatils;

}
