package com.danasys.user.request;

import lombok.Data;

@Data
public class UserPasswordRequest {
 private String oldPassword;
 private String newPassword;
}
