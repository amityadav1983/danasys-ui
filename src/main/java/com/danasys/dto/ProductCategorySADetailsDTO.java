package com.danasys.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ProductCategorySADetailsDTO  implements Serializable {

	private static final long serialVersionUID = 1L;
	
	private Long id;
	private ProductCategoryEnum categoryName;
	private String image;
	private String theemColorCode;
	List<BusinessProfileDetailsDTO> linkedBusinessProfile=new ArrayList<>();
}
