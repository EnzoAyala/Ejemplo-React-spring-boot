package com.aprender.backend.domain.dto.request;

import lombok.Data;

import java.time.LocalDate;

@Data
public class SubscriptionRequest {
    private Long userId;
    private String plan;
    private LocalDate startDate;
    private LocalDate endDate;
    private PaymentDetails paymentDetails;

    @Data
    public static class PaymentDetails {
        private String cardNumber;
        private String expiryDate;
        private String cvc;
        private String name;
        private String transactionId;
    }
}
