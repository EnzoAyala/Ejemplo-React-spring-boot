package com.aprender.backend.domain.dto.request;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ProfileUpdateRequest {
    private String name;
    private String lastname;
    private String description;
    private String phone;
}
