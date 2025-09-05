package com.danasys.user.request;

import java.util.List;

import lombok.Data;

@Data
public class UpdateBusinessProfileRequest {
	private Long id;
	private String ownerName;
	
	private String storeName;

	private List<UserBusinessAddressRequest> businessAddresses;
}
