package com.aprender.backend.socketconfig;

import org.springframework.context.ApplicationEvent;

import com.aprender.backend.entity.User;

public class OnNewUserRegisteredEvent extends ApplicationEvent {
    private final User newUser;

    public OnNewUserRegisteredEvent(Object source, User newUser) {
        super(source);
        this.newUser = newUser;
    }

    public User getNewUser() {
        return newUser;
    }
}