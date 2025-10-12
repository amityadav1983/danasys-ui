package com.danasys.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserBusinessProfileManagerDTO {
	private Long id;
	private String fullname;
	private String contactInfo;
	private String userProfilePicture;
	private String storeName;

}
