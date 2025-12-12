package com.aprender.backend.web.controller;

import com.aprender.backend.domain.dto.request.SubscriptionRequest;
import com.aprender.backend.domain.services.SubscriptionService;
import com.aprender.backend.persistence.entity.Subscription;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/subscriptions/")
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    public SubscriptionController(SubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }

    @PostMapping("/change-plan")
    public ResponseEntity<Subscription> createSubscription(
            @RequestBody SubscriptionRequest subscriptionRequest) {

        Subscription newSubscription = subscriptionService.createSubscription(subscriptionRequest);

        return ResponseEntity.status(HttpStatus.CREATED).body(newSubscription);
    }
}
