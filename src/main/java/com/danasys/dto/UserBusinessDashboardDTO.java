package com.danasys.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import com.danasys.dto.ProductCategoryDTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserBusinessDashboardDTO  implements Serializable {

	private static final long serialVersionUID = 1L;
	
	private List<UserBusinessProfileDTO> userBusinessProfileDTOList = new ArrayList<>();
	
	private List<BusinessDashboaardFunctionalityDTO> buIconDetails = new ArrayList<>();

}
