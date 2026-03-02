import React, { useState, useEffect } from 'react';
import { BarChart3, Brain, Users, TrendingUp, Shield, BookOpen, CheckCircle, Sparkles, ArrowRight, ChevronRight, Zap, Target, Database, Code, Calendar, LineChart, Award, Bell } from 'lucide-react';
import '../index.css';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


export default function LandingPage() {
  const navigate = useNavigate();

  const [scrollY, setScrollY] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 6);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: Brain, title: 'AI-Based Dropout Prediction', desc: 'Machine learning algorithms analyze patterns to predict at-risk students' },
    { icon: BarChart3, title: 'ML Risk Analysis', desc: 'Sophisticated models categorize students into low, medium, and high risk groups' },
    { icon: Users, title: 'Role-Based Dashboards', desc: 'Customized interfaces for admins, mentors, and students' },
    { icon: TrendingUp, title: 'Academic & Attendance Tracking', desc: 'Real-time monitoring of student performance indicators' },
    { icon: Sparkles, title: 'Early Counseling & Guidance', desc: 'Proactive intervention before problems escalate' },
    { icon: Shield, title: 'Secure Authentication', desc: 'Role-based access control ensures data privacy' }
  ];

  const benefits = [
    { icon: TrendingUp, text: 'Reduces dropout rates by up to 40%' },
    { icon: Target, text: 'Improves student success and retention' },
    { icon: Brain, text: 'Supports data-driven faculty decisions' },
    { icon: Sparkles, text: 'Enables personalized counseling' },
    { icon: CheckCircle, text: 'Enhances institutional reputation' }
  ];

  const stats = [
    { value: '40%', label: 'Reduction in Dropout' },
    { value: '85%', label: 'Prediction Accuracy' },
    { value: '10K+', label: 'Students Tracked' },
    { value: '24/7', label: 'Real-time Monitoring' }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap');
        
        * {
          font-family: 'Inter', sans-serif;
        }
        
        .mono {
          font-family: 'JetBrains Mono', monospace;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        
        @keyframes slide-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        
        .animate-slide-in {
          animation: slide-in 0.8s ease-out forwards;
        }

        .animate-shimmer {
          animation: shimmer 3s infinite;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(99, 102, 241, 0.3) 50%,
            transparent 100%
          );
          background-size: 1000px 100%;
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradient-shift 3s ease infinite;
        }

        .gradient-border {
          position: relative;
          background: rgba(15, 15, 35, 0.6);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 2px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7);
        }

        .gradient-border-content {
          background: rgba(0, 0, 0, 0.95);
          border-radius: 22px;
          padding: 2rem;
        }
        
        .glass-effect {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .glass-effect-strong {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(30px);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }
        
        .hover-lift {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .hover-lift:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 60px rgba(99, 102, 241, 0.4);
        }
        
        .grid-pattern {
          background-image: 
            linear-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
        }

        .radial-gradient {
          background: radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
        }

        .pulse-dot {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .nav-blur {
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 nav-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/50">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">EduTrack</span>
          </div>
          
              <div className="hidden md:flex items-center gap-8">
      <a href="#" className="text-slate-400 hover:text-white transition-colors font-medium">Home</a>
      <a href="#features" className="text-slate-400 hover:text-white transition-colors font-medium">Features</a>
      <a href="#benefits" className="text-slate-400 hover:text-white transition-colors font-medium">Benefits</a>
      <a href="#users" className="text-slate-400 hover:text-white transition-colors font-medium">Users</a>
    </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-semibold transition-all duration-300 shadow-lg shadow-indigo-500/40"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-black">
        {/* Background Effects */}
        <div className="absolute inset-0 grid-pattern opacity-30"></div>
        
        {/* Large gradient orbs */}
        <div 
          className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full blur-3xl opacity-15"
          style={{ 
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.5) 0%, transparent 70%)',
            transform: `translateY(${scrollY * 0.2}px)`
          }}
        ></div>
        <div 
          className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl opacity-15"
          style={{ 
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.5) 0%, transparent 70%)',
            transform: `translateY(${scrollY * 0.15}px)`
          }}
        ></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32">
          <div className="text-center mb-16">
            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-[1.1] animate-slide-in" style={{ animationDelay: '0.1s' }}>
              Let's build AI-powered<br />
              <span className="gradient-text">student success</span> together
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-in" style={{ animationDelay: '0.2s' }}>
              Our platform helps you predict, prevent, and reduce student dropout — so you can focus on what matters.
            </p>
  

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto animate-slide-in" style={{ animationDelay: '0.4s' }}>
              {stats.map((stat, idx) => (
                <div key={idx} className="glass-effect-strong rounded-2xl p-6 text-center hover-lift border border-white/20">
                  <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-32 relative bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              The <span className="gradient-text">Critical Challenge</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Student dropout is a growing crisis affecting institutions worldwide
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-effect-strong rounded-2xl p-8 hover-lift border border-white/20">
              <div className="w-14 h-14 rounded-xl bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/30">
                <Zap className="w-7 h-7 text-red-400" />
              </div>
              <h3 className="text-2xl font-bold mb-6 text-white">Rising Dropout Rates</h3>
              <ul className="space-y-4 text-slate-300">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Poor academic performance goes unnoticed until it's too late</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Low attendance patterns are identified after students have disengaged</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Financial difficulties lead to sudden withdrawals</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Lack of mentoring and personalized guidance</span>
                </li>
              </ul>
            </div>
            
            <div className="glass-effect-strong rounded-2xl p-8 hover-lift border border-white/20">
              <div className="w-14 h-14 rounded-xl bg-orange-500/10 flex items-center justify-center mb-6 border border-orange-500/30">
                <Target className="w-7 h-7 text-orange-400" />
              </div>
              <h3 className="text-2xl font-bold mb-6 text-white">Why Systems Fail</h3>
              <ul className="space-y-4 text-slate-300">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Manual tracking is time-consuming and error-prone</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Reactive approach rather than proactive intervention</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>No predictive intelligence or early warning systems</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Lack of centralized platform for stakeholders</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why EduTrack */}
      <section className="py-32 relative bg-black">
        <div className="absolute inset-0 radial-gradient"></div>
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 glass-effect rounded-full mb-6 border border-indigo-500/20">
              <span className="text-sm mono text-indigo-400">THE SOLUTION</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why <span className="gradient-text">EduTrack</span> Is Essential
            </h2>
          </div>
          
          <div className="glass-effect-strong rounded-3xl p-12 border-2 border-indigo-500/30">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center group">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 flex items-center justify-center border border-indigo-500/40 group-hover:scale-110 transition-transform duration-300">
                  <Brain className="w-10 h-10 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">AI-Powered Intelligence</h3>
                <p className="text-slate-400 leading-relaxed">Machine learning models that detect patterns invisible to manual monitoring</p>
              </div>
              
              <div className="text-center group">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 flex items-center justify-center border border-purple-500/40 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-10 h-10 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Proactive Intervention</h3>
                <p className="text-slate-400 leading-relaxed">Early detection enables timely support before students fall behind</p>
              </div>
              
              <div className="text-center group">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-pink-500/20 to-pink-600/10 flex items-center justify-center border border-pink-500/40 group-hover:scale-110 transition-transform duration-300">
                  <Database className="w-10 h-10 text-pink-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Centralized Platform</h3>
                <p className="text-slate-400 leading-relaxed">Unified system connecting admins, mentors, and students seamlessly</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-32 relative bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Powerful <span className="gradient-text">Features</span>
            </h2>
            <p className="text-xl text-slate-400">Comprehensive tools for dropout prevention</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div 
                key={idx}
                className={`glass-effect-strong rounded-2xl p-8 hover-lift cursor-pointer transition-all duration-300 border ${
                  activeFeature === idx ? 'ring-2 ring-indigo-500/50 bg-indigo-500/5 border-indigo-500/40' : 'border-white/20'
                }`}
                onMouseEnter={() => setActiveFeature(idx)}
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4 border border-indigo-500/30">
                  <feature.icon className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-32 relative bg-black">
        <div className="absolute inset-0 radial-gradient"></div>
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Measurable <span className="gradient-text">Impact</span>
            </h2>
            <p className="text-xl text-slate-400">Transform your institution's success rates</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="glass-effect-strong rounded-2xl p-8 hover-lift flex items-start gap-4 border border-green-500/20">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/10 flex items-center justify-center flex-shrink-0 border border-green-500/40">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
                <p className="text-lg text-slate-200 leading-relaxed">{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="users" className="py-32 relative bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Perfect For <span className="gradient-text">Every Institution</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: BookOpen, title: 'Colleges & Universities', desc: 'Comprehensive student success management for higher education institutions' },
              { icon: Users, title: 'Mentoring Programs', desc: 'Data-driven counseling and personalized student support systems' },
              { icon: BarChart3, title: 'Analytics Systems', desc: 'Advanced educational insights and predictive analytics platform' }
            ].map((useCase, idx) => (
              <div key={idx} className="glass-effect-strong rounded-2xl p-8 text-center hover-lift group border border-white/20">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/10 flex items-center justify-center border border-indigo-500/40 group-hover:scale-110 transition-transform duration-300">
                  <useCase.icon className="w-10 h-10 text-indigo-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">{useCase.title}</h3>
                <p className="text-slate-400 leading-relaxed">{useCase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
    </div>
  );
}