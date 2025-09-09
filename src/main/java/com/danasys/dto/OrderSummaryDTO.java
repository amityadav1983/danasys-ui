package com.danasys.dto;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class OrderSummaryDTO implements Serializable{

	private static final long serialVersionUID = 1L;
	
	private Long orderId;
	
	private Double totalPrice;
	
	private Double totalDiscount;
	
	private Date dateOfDelivery;
	
}
