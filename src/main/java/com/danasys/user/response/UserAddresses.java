package com.danasys.user.response;

import lombok.Builder;
import lombok.Data;


@Data
public class UserAddresses {
	private Long id;
	private String address;
	private boolean isDefault;

}
