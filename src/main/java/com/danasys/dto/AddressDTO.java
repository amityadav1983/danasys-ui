package com.danasys.dto;

import java.io.Serializable;

import com.danasys.user.enums.AddressTypeEnum;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddressDTO  implements Serializable {

	
	private Long id;

	//private BankAccountDTO bankAccounts;

	private UserProfileDTO userProfile;

	private UserBusinessProfileDTO userBusinessProfile;

	private ServiceAreaDTO serviceArea;


	private AddressTypeEnum type;

	private String fullAddress;

	@Override
	public String toString() {
		return "AddressDTO [type=" + type + ", fullAddress=" + fullAddress + " - " + serviceArea + " ]";
	}

	
	
}
