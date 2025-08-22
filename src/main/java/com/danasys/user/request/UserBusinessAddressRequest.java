package com.danasys.user.request;

import com.danasys.user.enums.AddressTypeEnum;

import lombok.Data;

@Data
public class UserBusinessAddressRequest {


    private Long id;

    private BusinesBankAccountRequest bankAccount;

    private UserServiceAreaRequest serviceArea;

    private AddressTypeEnum type;

    private String fullAddress;
    
    private boolean isDefault;
}
