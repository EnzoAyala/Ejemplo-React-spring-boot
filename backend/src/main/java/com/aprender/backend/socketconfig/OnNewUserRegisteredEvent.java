package com.aprender.backend.socketconfig;

import com.aprender.backend.model.User;
import org.springframework.context.ApplicationEvent;

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