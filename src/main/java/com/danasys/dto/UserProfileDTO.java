package com.danasys.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UserProfileDTO {

	private Long id;

	private String fullname;

	private String email;

	private String contactInfo;

	private String userProfilePicture;

	private UserProfileDTO parentProfile;

	private UserProfileDTO managerProfile;

	private StatusEnum status;

	private String refernceNo;

	private List<UserProfileDTO> childProfiles;

	private List<UserProfileDTO> managedProfiles;

	private List<UserBusinessProfileDTO> businessProfiles;
}
