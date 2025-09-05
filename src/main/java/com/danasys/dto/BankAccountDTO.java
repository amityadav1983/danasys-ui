package com.danasys.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BankAccountDTO {
	private Long id;

	private Long accountNumber;
	private String bankName;
	private String branch;
	private String accountHolderName;
	private String bankIfscCode;
	private Long userProfileId;
	// private Long userBusinessProfileId;
	private String bankAccountType;
}
