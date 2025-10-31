package com.danasys.dto;

import java.io.Serializable;
import java.util.List;


import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class TransferMoneyDTO implements Serializable{

	private static final long serialVersionUID = 1L;
	
	private Long requestdUserProfileId;
	
	private Long bankId;
	
	private Double amount;
	
	private String transactionID;
	
	private String comments;
}
