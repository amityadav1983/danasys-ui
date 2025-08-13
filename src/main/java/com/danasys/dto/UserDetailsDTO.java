package com.danasys.dto;

import lombok.Getter;
import lombok.Setter;
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
	
	private List<String> dealOfTheDayImages;


}
