package com.aprender.backend.payload.request;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ProfileUpdateRequest {
    private String name;
    private String lastname;
    private String phone;
}
