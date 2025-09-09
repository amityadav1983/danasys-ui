package com.danasys.dto;

public enum ReferralPointStatusEnum {

	ELIGIBLE, // eligible but not in use until return date not passed
	TAKENBACK, // in case order cancelled
	CREDITED, // return date passed and this is in account
	REDEEMED // this being redeemed and and for only use full for history 
}
