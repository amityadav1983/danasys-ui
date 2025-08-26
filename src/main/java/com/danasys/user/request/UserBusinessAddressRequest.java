package com.danasys.user.request;

import lombok.Data;

@Data
public class UserBusinessAddressRequest {

    private Long id;

    private BusinesBankAccountRequest bankAccount;

    private String shopAddress;

}
