package com.danasys.dto;

import java.io.Serializable;
import java.util.Date;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class OrderDTO implements Serializable {

	private static final long serialVersionUID = 1L;

	private Long id;

	private OrdarStatusEnum orderStatus;

	private List<PurchasedProductDTO> products;

	private Date orderDeliverTimeSlot;

	private UserProfileDTO customerUserProfile;

	private UserBusinessProfileDTO businessUserProfile;

	private AddressDTO deliveryAddress;
	
	 private PaymentSourceEnum paymentSource = PaymentSourceEnum.USER_ACCOUNT;
	
	public Double totalPrice() {
		Double totalPrice = 0d;
		for (PurchasedProductDTO product : this.products) {
			totalPrice = totalPrice + product.getOfferPrice();
		}

		return totalPrice;
	}
}
