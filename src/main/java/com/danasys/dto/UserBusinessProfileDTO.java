package com.danasys.dto;

import java.util.ArrayList;
import java.util.List;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserBusinessProfileDTO {

	private Long id;

	private String ownerName;
	
	private String storeName;

	private ProductCategoryDTO category;

	private String businessLogoPath;

	private UserProfileDTO userProfile;

	private List<AddressDTO> addresses = new ArrayList<>();
}
