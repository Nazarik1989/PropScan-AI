import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "./ui/button";

const tiers = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for testing the capabilities of our AI.",
    features: [
      "3 documents per month",
      "Basic risk summary",
      "Standard processing time",
      "Email support",
    ],
    buttonText: "Start for free",
    buttonVariant: "outline" as const,
    href: "/",
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For professionals who need reliable, daily analysis.",
    features: [
      "Unlimited documents",
      "Full risk report with references",
      "Priority processing (under 30s)",
      "Export to PDF / Word",
      "Missing document detection",
    ],
    buttonText: "Upgrade to Pro",
    buttonVariant: "default" as const,
    popular: true,
    href: "/",
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large firms requiring custom workflows.",
    features: [
      "Custom document volume",
      "Team access & management",
      "API access",
      "Dedicated account manager",
      "Advanced compliance features",
    ],
    buttonText: "Contact sales",
    buttonVariant: "outline" as const,
    href: "mailto:sales@propertyinsight.ai",
  },
];

export default function Pricing() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-slate-600">
            Invest in tools that provide immediate ROI. One saved mistake pays for a lifetime subscription.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {tiers.map((tier, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative flex flex-col p-8 rounded-2xl bg-white border ${
                tier.popular ? "border-blue-500 shadow-xl shadow-blue-500/10" : "border-slate-200 shadow-sm"
              }`}
            >
              {tier.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full uppercase tracking-wide">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-4xl font-bold text-slate-900">{tier.price}</span>
                  {tier.period && <span className="text-slate-500">{tier.period}</span>}
                </div>
                <p className="text-sm text-slate-600 h-10">{tier.description}</p>
              </div>
              
              <ul className="space-y-4 mb-8 flex-1">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-blue-500 shrink-0" />
                    <span className="text-sm text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <a href={tier.href} className="block w-full">
                <Button 
                  variant={tier.buttonVariant} 
                  className={`w-full ${tier.popular ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}`}
                  size="lg"
                >
                  {tier.buttonText}
                </Button>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}