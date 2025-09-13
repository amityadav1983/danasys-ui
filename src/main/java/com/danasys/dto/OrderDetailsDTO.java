package com.danasys.dto;

import java.util.Date;
import java.util.List;



import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class OrderDetailsDTO {

	private Long id;

	private OrdarStatusEnum orderStatus;

	private List<PurchasedProductDTO> products;

	private Date orderDeliverTimeSlot;
	
	private Double totalPrice;
	
	private Double totalDiscount;
	
	private String deliveryAddress;
	
	private OrderTrackerDTO orderTracker;
	
}
