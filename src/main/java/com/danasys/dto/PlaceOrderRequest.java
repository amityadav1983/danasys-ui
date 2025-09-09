package com.danasys.dto;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class PlaceOrderRequest implements Serializable {
	private static final long serialVersionUID = 1L;
	private Long orderId;
	private Long customerUserProfileId;
	private Long businessUserProfileId;
	private List<OrderItems> items;
	private Double platformFees;
	private PaymentSourceEnum paymentSource = PaymentSourceEnum.USER_ACCOUNT;

	@Getter
	@Setter
	public static class OrderItems {
		private Long productId;
		private int quantity;
		 @JsonProperty("available")
		private boolean isAvailable;
	}
}