package com.danasys.user.request;

import java.util.List;

import com.danasys.dto.ProductCategoryDTO;

import lombok.Data;

@Data
public class BusinessProfileRequest {
	private Long id;
	private String ownerName;
	
	private String storeName;

	private ProductCategoryDTO category;

	private List<UserBusinessAddressRequest> businessAddresses;
	
	private BusinesBankAccountRequest bankAccount;
}
