package com.danasys.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;


import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UserAccountTransactionDTO implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private Double currentBalance;
	private List<BankTransferRequestDTO> transferReqDTO = new ArrayList<>();
	
	private List<TransactionDTO> transactionDTO  = new ArrayList<>();

}
