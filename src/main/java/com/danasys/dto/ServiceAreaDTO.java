package com.danasys.dto;

import java.util.HashSet;
import java.util.Set;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ServiceAreaDTO {
	private static final long serialVersionUID = 1L;
	private Long id;
	private String fullAddress;
	private int pinCode;
	private StatusEnum status;
	private String district;
	private String state;
	private Set<ProductCategoryDTO> productCategories = new HashSet<>();;
}
