package com.danasys.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UserDetailsDTO {

	private String fullname;

	private String email;

	private String contactInfo;

	private String userProfilePicture;

	private StatusEnum status;
	
	private String address;
	
	private String greetingOfTheDay;
	
	private List<String> dealOfTheDayImages;
	
	private Long serviceAreaId;
	
	private String userWalletImage;


}
