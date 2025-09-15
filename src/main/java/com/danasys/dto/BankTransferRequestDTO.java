package com.danasys.dto;


import java.io.Serializable;
import java.util.Date;

import com.danasys.user.enums.AccountTransferStatusEnum;
import com.danasys.user.enums.TransferRequestTypeEnum;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class BankTransferRequestDTO implements Serializable{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private Long id;
  	
	private String amount;
  	
  	private String bankName;
  	
	private String toUser;
	
	private Date reqDate;
	
	private String reqRaisedBy;
  	
  	private AccountTransferStatusEnum status;
  	
	private TransferRequestTypeEnum requestType;
}
