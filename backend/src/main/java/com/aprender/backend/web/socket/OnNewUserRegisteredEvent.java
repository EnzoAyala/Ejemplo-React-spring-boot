package com.aprender.backend.web.socket;

import org.springframework.context.ApplicationEvent;

import com.aprender.backend.persistence.entity.User;

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