package com.aprender.backend.domain.mappers;

import com.aprender.backend.domain.dto.request.SubscriptionRequest;
import com.aprender.backend.persistence.entity.Subscription;
import com.aprender.backend.persistence.entity.User;
import org.springframework.stereotype.Component;

@Component
public class SubscriptionMapper {

    public Subscription toEntity(SubscriptionRequest request, User user) {
        Subscription subscription = new Subscription();

        subscription.setUser(user);
        subscription.setPlan(request.getPlan());
        subscription.setStartDate(request.getStartDate());
        subscription.setEndDate(request.getEndDate());

        if (request.getPaymentDetails() != null) {
            subscription.setTransactionId(
                    request.getPaymentDetails().getTransactionId());
        }

        return subscription;
    }
}
