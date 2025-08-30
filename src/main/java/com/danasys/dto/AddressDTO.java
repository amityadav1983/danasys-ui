package com.danasys.dto;

import java.io.Serializable;

import com.danasys.user.enums.AddressTypeEnum;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddressDTO  implements Serializable {

	
	private Long id;


	private AddressTypeEnum type;

	private String fullAddress;

	
	
}
