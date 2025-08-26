package com.danasys.user.request;

import lombok.Data;

@Data
public class BusinesBankAccountRequest {
	private Long id;
	private Long accountNumber; 
	private String bankAccountHolderName;
	private String bankName; 
	private String bankBranch;
	private String bankIFSCCode;
	private String bankAccountType;
}
