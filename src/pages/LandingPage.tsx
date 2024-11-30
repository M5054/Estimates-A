import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BarChart2, FileText, Users, Building2, ChevronRight, Check } from 'lucide-react';

const plans = [
  {
    name: 'Basic',
    price: '17.99',
    description: 'Perfect for freelancers and small businesses',
    features: [
      'Up to 10 estimates per month',
      'Basic client management',
      'PDF export',
      'Email estimates',
      'Basic templates',
    ],
  },
  {
    name: 'Professional',
    price: '24.99',
    description: 'Ideal for growing businesses',
    features: [
      'Unlimited estimates',
      'Advanced client management',
      'Custom branding',
      'Multiple templates',
      'Team collaboration',
      'Analytics dashboard',
    ],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '37.99',
    description: 'For large organizations',
    features: [
      'Everything in Professional',
      'Priority support',
      'API access',
      'Custom integrations',
      'Advanced analytics',
      'Dedicated account manager',
      'Custom contract terms',
    ],
  },
];

const LandingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const showUpgrade = searchParams.get('upgrade') === 'true';

  useEffect(() => {
    if (showUpgrade) {
      const pricingSection = document.getElementById('pricing');
      if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [showUpgrade]);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20">
        <div className="mx-auto max-w-7xl pb-24 pt-10 sm:pb-32 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-40">
          <div className="px-6 lg:px-0 lg:pt-4">
            <div className="mx-auto max-w-2xl">
              <div className="max-w-lg">
                <div className="mt-24 sm:mt-32 lg:mt-16">
                  <div className="inline-flex space-x-6">
                    <span className="rounded-full bg-indigo-600/10 px-3 py-1 text-sm font-semibold leading-6 text-indigo-600 ring-1 ring-inset ring-indigo-600/10">
                      What's new
                    </span>
                    <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-600">
                      <span>Just shipped v1.0</span>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </span>
                  </div>
                </div>
                <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                  EstimadoPro
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  Create professional estimates in minutes. Streamline your business operations with our
                  powerful estimation and client management platform.
                </p>
                <div className="mt-10 flex items-center gap-x-6">
                  <Link
                    to="/signup"
                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Get started
                  </Link>
                  <Link to="/login" className="text-sm font-semibold leading-6 text-gray-900">
                    Sign in <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-20 sm:mt-24 md:mx-auto md:max-w-2xl lg:mx-0 lg:mt-0 lg:w-screen">
            {/* ... existing hero section content ... */}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="py-24 sm:py-32 scroll-mt-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Pricing</h2>
            <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Choose the right plan for your business
            </p>
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
            Flexible plans that grow with your business. All plans include a 14-day free trial.
          </p>
          
          <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 xl:gap-x-12">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-3xl p-8 ring-1 ${
                  plan.popular
                    ? 'bg-gray-900 ring-gray-900'
                    : 'ring-gray-200 bg-white/60'
                }`}
              >
                <h3
                  className={`text-lg font-semibold leading-8 ${
                    plan.popular ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`mt-4 text-sm leading-6 ${
                    plan.popular ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  {plan.description}
                </p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span
                    className={`text-4xl font-bold tracking-tight ${
                      plan.popular ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    ${plan.price}
                  </span>
                  <span
                    className={`text-sm font-semibold leading-6 ${
                      plan.popular ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
                    /month
                  </span>
                </p>
                <Link
                  to="/signup"
                  className={`mt-6 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                    plan.popular
                      ? 'bg-white text-gray-900 hover:bg-gray-100 focus-visible:outline-white'
                      : 'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600'
                  }`}
                >
                  Get started today
                </Link>
                <ul
                  className={`mt-8 space-y-3 text-sm leading-6 ${
                    plan.popular ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <Check
                        className={`h-6 w-5 flex-none ${
                          plan.popular ? 'text-white' : 'text-indigo-600'
                        }`}
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        {/* ... existing features section content ... */}
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-50">
        {/* ... existing CTA section content ... */}
      </div>
    </div>
  );
};

export default LandingPage;