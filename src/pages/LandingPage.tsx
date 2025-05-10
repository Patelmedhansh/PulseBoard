import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';
import { MonitoringScene } from '../components/3d/MonitoringScene';
import { FloatingMetrics } from '../components/animations/FloatingMetrics';
import { NetworkGrid } from '../components/animations/NetworkGrid';
import { cn } from '../utils/cn';
import {
  Activity,
  BarChart2,
  LineChart,
  Database,
  Bell,
  Zap,
  Shield,
  Users,
  CheckCircle,
  Gauge,
  Cpu,
  Network,
  Server,
  Wifi,
  MonitorCheck,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  useEffect(() => {
    document.title = 'PulseBoard by CLOUD CRAFT LLP - Enterprise Application Monitoring';
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const floatingAnimation = {
    y: [-10, 10],
    transition: {
      y: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }
  };

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const rotateAnimation = {
    rotate: [0, 360],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "linear"
    }
  };

  return (
    <div className="min-h-screen bg-background text-white overflow-x-hidden">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <MonitoringScene />
          <NetworkGrid />
        </div>
        
        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative pt-32 pb-20 md:pt-40 md:pb-32">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="flex justify-center mb-8"
            >
              <div className="relative">
                <motion.div 
                  className="p-4 bg-primary-900/50 rounded-full relative z-10"
                  animate={pulseAnimation}
                >
                  <Activity className="h-16 w-16 text-primary-400" />
                </motion.div>
                <motion.div 
                  className="absolute inset-0 bg-primary-500/20 rounded-full blur-2xl"
                  animate={pulseAnimation}
                />
                
                {/* Orbiting Elements */}
                <motion.div 
                  className="absolute -top-4 -left-4 p-2 bg-secondary-900/50 rounded-full"
                  animate={rotateAnimation}
                  style={{ transformOrigin: "center center" }}
                >
                  <Gauge className="h-4 w-4 text-secondary-400" />
                </motion.div>
                <motion.div 
                  className="absolute -bottom-2 -right-2 p-2 bg-accent-900/50 rounded-full"
                  animate={{
                    ...rotateAnimation,
                    rotate: [360, 0]
                  }}
                  style={{ transformOrigin: "center center" }}
                >
                  <Cpu className="h-4 w-4 text-accent-400" />
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="space-y-6"
            >
              <h1 className="text-4xl md:text-6xl font-bold font-display">
                <span className="bg-gradient-to-r from-white via-primary-200 to-primary-400 bg-clip-text text-transparent animate-gradient-x">
                  Monitor Your Apps
                </span>
                <br />
                <span className="bg-gradient-to-r from-secondary-400 to-accent-400 bg-clip-text text-transparent">
                  With Superpowers
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
                Real-time insights with advanced analytics and AI-powered monitoring.
                Your applications deserve superhero-level observability!
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="flex flex-col sm:flex-row justify-center gap-4 mt-10"
            >
              <Button
                as={Link}
                to="/auth/register"
                variant="primary"
                size="lg"
                className="shadow-glow relative overflow-hidden group"
              >
                <span className="relative z-10">Start Monitoring</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => scrollToSection('features')}
                className="border-primary-500/30 hover:border-primary-500 relative overflow-hidden group"
              >
                <span className="relative z-10">Explore Features</span>
                <div className="absolute inset-0 bg-primary-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-20"
          >
            <FloatingMetrics />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background-light to-background opacity-80" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Superhero Features
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto"
            >
              Everything you need to monitor and optimize your applications
            </motion.p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {/* Feature Cards */}
            {[
              {
                icon: LineChart,
                title: "Real-time Metrics",
                description: "Monitor your application performance in real-time with detailed metrics and visualizations.",
                color: "primary"
              },
              {
                icon: Bell,
                title: "Smart Alerts",
                description: "Get instant notifications when something needs your attention.",
                color: "secondary"
              },
              {
                icon: BarChart2,
                title: "Custom Dashboards",
                description: "Build your perfect monitoring setup with drag-and-drop widgets.",
                color: "accent"
              },
              {
                icon: Database,
                title: "Multiple Data Sources",
                description: "Connect to various data sources for comprehensive monitoring.",
                color: "success"
              },
              {
                icon: Shield,
                title: "Enterprise Security",
                description: "Bank-grade security to protect your sensitive monitoring data.",
                color: "warning"
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Optimized performance with real-time updates and minimal latency.",
                color: "error"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg" />
                <div className="relative bg-background-light p-6 rounded-lg border border-primary-500/20 shadow-glow overflow-hidden">
                  <motion.div
                    animate={{
                      rotate: [0, 5, -5, 0],
                      transition: { duration: 2, repeat: Infinity }
                    }}
                    className="p-3 bg-primary-900/30 rounded-md w-fit mb-4"
                  >
                    <feature.icon className={`h-6 w-6 text-${feature.color}-500`} />
                  </motion.div>
                  <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background-light to-background opacity-80" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Pricing for Every Team
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto"
            >
              Start monitoring your applications today
            </motion.p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {/* Pricing Cards */}
            {[
              {
                name: "Starter",
                price: "Free",
                description: "Perfect for side projects",
                features: [
                  "Up to 3 applications",
                  "Basic metrics",
                  "24-hour data retention",
                  "Community support"
                ]
              },
              {
                name: "Pro",
                price: "$29",
                description: "For growing teams",
                features: [
                  "Up to 10 applications",
                  "Advanced metrics",
                  "30-day data retention",
                  "Priority support",
                  "Custom dashboards"
                ],
                popular: true
              },
              {
                name: "Enterprise",
                price: "Custom",
                description: "For large organizations",
                features: [
                  "Unlimited applications",
                  "Advanced security",
                  "90-day data retention",
                  "24/7 phone support",
                  "Custom integrations"
                ]
              }
            ].map((plan, index) => (
              <motion.div
                key={plan.name}
                variants={fadeInUp}
                className={cn(
                  "relative group",
                  plan.popular && "md:-mt-8"
                )}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                    Most Popular
                  </div>
                )}
                <div className={cn(
                  "relative bg-background-light p-6 rounded-lg border transition-all duration-300",
                  plan.popular
                    ? "border-primary-500 shadow-glow"
                    : "border-primary-500/20 group-hover:border-primary-500/50 group-hover:shadow-glow"
                )}>
                  <h3 className="text-xl font-medium mb-2">{plan.name}</h3>
                  <div className="flex items-baseline mb-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.price !== "Custom" && <span className="text-gray-400 ml-2">/month</span>}
                  </div>
                  <p className="text-gray-400 mb-6">{plan.description}</p>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-primary-500 mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    as={Link}
                    to="/auth/register"
                    variant={plan.popular ? "primary" : "outline"}
                    className="w-full"
                  >
                    Get Started
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background-light to-background opacity-80" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              About PulseBoard
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto"
            >
              Built by developers, for developers
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-gray-300 mb-6">
                We believe that monitoring should be simple, powerful, and accessible to everyone. Our mission is to provide developers with the tools they need to build and maintain reliable applications.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="p-2 bg-primary-900/30 rounded-md mr-3">
                    <Users className="h-5 w-5 text-primary-500" />
                  </div>
                  <div>
                    <h4 className="font-medium">Built for Teams</h4>
                    <p className="text-sm text-gray-400">Collaborative monitoring for modern teams</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="p-2 bg-secondary-900/30 rounded-md mr-3">
                    <Shield className="h-5 w-5 text-secondary-500" />
                  </div>
                  <div>
                    <h4 className="font-medium">Enterprise Security</h4>
                    <p className="text-sm text-gray-400">Your data is safe with us</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="p-2 bg-accent-900/30 rounded-md mr-3">
                    <Zap className="h-5 w-5 text-accent-500" />
                  </div>
                  <div>
                    <h4 className="font-medium">Lightning Fast</h4>
                    <p className="text-sm text-gray-400">Real-time monitoring at scale</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="aspect-video rounded-lg overflow-hidden border border-primary-500/20 shadow-glow">
                <img
                  src="https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg"
                  alt="Team"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-primary-900 to-primary-800 rounded-lg p-8 md:p-12 shadow-glow relative overflow-hidden"
          >
            <div className="absolute inset-0">
              <NetworkGrid />
            </div>
            <div className="relative">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-6 md:mb-0 md:mr-8">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to level up your monitoring?</h2>
                  <p className="text-lg text-gray-200">
                    Join thousands of developers who trust PulseBoard for their application monitoring needs.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    as={Link}
                    to="/auth/register"
                    variant="accent"
                    size="lg"
                    className="shadow-glow"
                  >
                    Get Started Free
                  </Button>
                  <Button
                    as="a"
                    href="mailto:sales@pulseboard.io"
                    variant="outline"
                    size="lg"
                    className="border-white hover:bg-white/10"
                  >
                    Contact Sales
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background-light py-12 border-t border-primary-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-medium mb-4">Product</h3>
              <ul className="space-y-2">
                <li><button onClick={() => scrollToSection('features')} className="text-gray-400 hover:text-white transition-colors">Features</button></li>
                <li><button onClick={() => scrollToSection('pricing')} className="text-gray-400 hover:text-white transition-colors">Pricing</button></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Release Notes</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Company</h3>
              <ul className="space-y-2">
                <li><button onClick={() => scrollToSection('about')} className="text-gray-400 hover:text-white transition-colors">About Us</button></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Tutorials</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">GDPR</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <Activity className="h-8 w-8 text-primary-500 mr-2" />
                <span className="font-display text-xl font-bold">PulseBoard</span>
              </div>
              <p className="text-gray-400">
                &copy; {new Date().getFullYear()} CLOUD CRAFT LLP. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};