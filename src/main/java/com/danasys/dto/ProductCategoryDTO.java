package com.danasys.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ProductCategoryDTO {
	private static final long serialVersionUID = 1L;
	
	private Long id;
	private String categoryName;
	private String description;
	private String status;
}
