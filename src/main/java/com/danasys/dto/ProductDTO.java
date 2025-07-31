package com.danasys.dto;

import java.io.Serializable;


import lombok.Getter;
import lombok.Setter;


@Setter
@Getter
public class ProductDTO implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	private Long id;
	private String name;
    private Double price;
    private Double offerPrice;
    private String category;
    private Integer quantity;
    private String description;
    private String image;
    private String moreAbout;
    private Long businessUserProfileId;
    private String status;
    private int version;

}
