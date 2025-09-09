package com.danasys.dto;

import java.io.Serializable;
import java.util.Date;


import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class PurchasedProductDTO implements Serializable {
	private static final long serialVersionUID = 1L;

	private Long purchasedProductId;

	private ProductDTO product;

	private Date returnDateLimit;
	
	private OrdarStatusEnum status;

	private int quantity;
	
	private Double MRP;
	
	private Double offerPrice;

}
