import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export { stripePromise };

export const createCheckoutSession = async (productId: string, priceId: string, interval: 'monthly' | 'yearly') => {
  // In a real app, this would call your backend API
  // For demo purposes, we'll simulate the Stripe checkout flow
  
  const stripe = await stripePromise;
  if (!stripe) throw new Error('Stripe failed to initialize');

  // Simulate API call to create checkout session
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      productId,
      priceId,
      interval,
      successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${window.location.origin}/cancel`,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create checkout session');
  }

  const session = await response.json();
  
  // Redirect to Stripe Checkout
  const result = await stripe.redirectToCheckout({
    sessionId: session.id,
  });

  if (result.error) {
    throw new Error(result.error.message);
  }
};

export const createStripeProduct = async (product: {
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
}) => {
  // Simulate Stripe product creation
  const stripeProduct = {
    id: `prod_${Date.now()}`,
    name: product.name,
    description: product.description,
    prices: {
      monthly: {
        id: `price_monthly_${Date.now()}`,
        amount: product.monthlyPrice * 100, // Stripe uses cents
        interval: 'month',
      },
      yearly: {
        id: `price_yearly_${Date.now()}`,
        amount: product.yearlyPrice * 100,
        interval: 'year',
      },
    },
  };

  return stripeProduct;
};

export const createCustomerPortalSession = async (customerId: string) => {
  // Simulate customer portal session creation
  return {
    url: `https://billing.stripe.com/p/session/test_${Date.now()}`,
  };
};