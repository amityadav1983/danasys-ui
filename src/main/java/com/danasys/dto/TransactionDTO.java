package com.danasys.dto;

import java.io.Serializable;
import java.util.Date;
import lombok.Getter;
import lombok.Setter;


@Setter
@Getter
public class TransactionDTO implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private String amount;

	private TransactionTypeEnum type; // PAYMENT, REFERRAL, REFUND, WITHDRAWAL, CONVERSION

	private Long orderId; 

	private Date transactionDatel;

}
