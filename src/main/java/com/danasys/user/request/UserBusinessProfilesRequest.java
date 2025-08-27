package com.danasys.user.request;

import java.util.List;

import lombok.Data;

@Data
public class UserBusinessProfilesRequest {
	public String userName;
    public List<BusinessProfileRequest> userBusinessProfiles;
}
