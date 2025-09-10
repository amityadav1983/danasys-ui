package com.danasys.dto;


import com.danasys.user.enums.AccountTransferStatusEnum;
import com.danasys.user.enums.TransferRequestTypeEnum;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class BankTransferRequestDTO {
	private Long id;
  	
  	private Long walletId;
  	
  	private Long accountId;
  	
  	private Long requestdUserProfileId;
  	
  	private String transactionId;
  	
  	private AccountTransferStatusEnum status;
  	
  	private TransferRequestTypeEnum requestType;
  	
  	private String name;
}
