import api from './api';

const API_URL = '/subscriptions';

class SubscriptionService {
  changePlan(subscriptionRequest) {
    return api.post(API_URL + '/change-plan', subscriptionRequest);
  }
}

export default new SubscriptionService();
