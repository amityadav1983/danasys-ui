package com.danasys.dto;

import java.util.ArrayList;
import java.util.List;

import com.danasys.user.response.UserServiceArea;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ServiceAreaDetails {

	List<UserServiceArea> userServiceAreaList = new ArrayList<>();
}
