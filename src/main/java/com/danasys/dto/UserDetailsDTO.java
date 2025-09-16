package com.danasys.dto;

import java.util.ArrayList;
import java.util.List;

import com.danasys.user.enums.UserRoleEnum;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserDetailsDTO {

	private String fullname;

	private String email;

	private String contactInfo;

	private String userProfilePicture;

	private StatusEnum status;
	
	private String houseNo;
	
	private String fullAddress;
	
	private String greetingOfTheDay;
	
	private List<String> dealOfTheDayImages;
	
	private Long serviceAreaId;
	
	private String userWalletImage;
	
	private List<UserRoleEnum> roles = new ArrayList<>();

	private String myQRCode;
	
	private String companyLogo;
	
	private Long userProfileId;


}
