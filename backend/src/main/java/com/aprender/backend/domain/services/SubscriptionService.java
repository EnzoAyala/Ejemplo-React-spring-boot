package com.aprender.backend.domain.services;

import com.aprender.backend.domain.dto.request.SubscriptionRequest;
import com.aprender.backend.domain.mappers.SubscriptionMapper;
import com.aprender.backend.domain.repository.SubscriptionRepository;
import com.aprender.backend.domain.repository.UserRepository;
import com.aprender.backend.persistence.entity.Subscription;
import com.aprender.backend.persistence.entity.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;
    private final SubscriptionMapper subscriptionMapper;

    public SubscriptionService(SubscriptionRepository subscriptionRepository,
                               UserRepository userRepository,
                               SubscriptionMapper subscriptionMapper) {
        this.subscriptionRepository = subscriptionRepository;
        this.userRepository = userRepository;
        this.subscriptionMapper = subscriptionMapper;
    }

    @Transactional
    public Subscription createSubscription(SubscriptionRequest subscriptionRequest) {

        User user = userRepository.findById(subscriptionRequest.getUserId())
                .orElseThrow(() ->
                        new RuntimeException("User not found with id: " )
                );

        Subscription subscription = subscriptionMapper.toEntity(subscriptionRequest, user);

        return subscriptionRepository.save(subscription);
    }
}
