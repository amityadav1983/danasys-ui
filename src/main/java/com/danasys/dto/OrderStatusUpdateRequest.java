package com.danasys.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class OrderStatusUpdateRequest implements Serializable {
	private static final long serialVersionUID = 1L;
	private Long orderId;
	private List<OrderItem> items;
	private Double platformFees;
	@Getter
	@Setter
	public static class OrderItem {
		private Long purchasedProductId;
		private OrdarStatusEnum status;
		private String comments;
		private int starRating;
	}
}
