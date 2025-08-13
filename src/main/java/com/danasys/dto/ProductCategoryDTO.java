package com.danasys.dto;



import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ProductCategoryDTO {
	private static final long serialVersionUID = 1L;
	private Long id;
	private ProductCategoryEnum categoryName;
	private String description;
	private StatusEnum status;
	private String image;
	private String theemColorCode;
}
