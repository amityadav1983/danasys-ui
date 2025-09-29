package com.danasys.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ProductCategorySADetailsDTO  implements Serializable {

	private static final long serialVersionUID = 1L;
	private Long id;
	private ProductCategoryEnum categoryName;
	private String image;
	private String theemColorCode;
	List<BusinessProfileDetailsDTO> linkedBusinessProfile=new ArrayList<>();
	private List<String> dashboardImages=new ArrayList<>();
	private String greetingOfTheDay;
	private List<String> dealOfTheDayImages=new ArrayList<>();;
}
