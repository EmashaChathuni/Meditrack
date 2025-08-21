import React, { useState } from 'react';
import { 
  Heart, 
  Droplets, 
  Brain, 
  Activity, 
  Clock, 
  User, 
  Calendar, 
  TrendingUp, 
  ArrowRight, 
  Star 
} from 'lucide-react';
import './HealthTipsPage.css';

const HealthTipsPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Tips', icon: Activity },
    { id: 'heart', name: 'Heart Health', icon: Heart },
    { id: 'mental', name: 'Mental Health', icon: Brain },
    { id: 'nutrition', name: 'Nutrition', icon: Droplets },
    { id: 'fitness', name: 'Fitness', icon: TrendingUp }
  ];

  const healthTips = [
    {
      id: 1,
      category: 'heart',
      title: '5 Essential Heart Health Habits',
      description: 'Discover proven strategies to strengthen your cardiovascular system and reduce heart disease risk through simple lifestyle modifications.',
      readTime: '5 min',
      author: 'Dr. Sarah Johnson',
      date: 'Aug 15, 2025',
      rating: 4.8,
      image: '❤️',
      tags: ['Prevention', 'Lifestyle', 'Diet'],
      featured: true
    },
    {
      id: 2,
      category: 'nutrition',
      title: 'Hydration: Your Body\'s Best Friend',
      description: 'Learn the science behind proper hydration and how it impacts every aspect of your health, from energy levels to skin quality.',
      readTime: '4 min',
      author: 'Dr. Michael Chen',
      date: 'Aug 12, 2025',
      rating: 4.6,
      image: '💧',
      tags: ['Hydration', 'Wellness', 'Performance']
    },
    {
      id: 3,
      category: 'mental',
      title: 'Mastering Stress Management',
      description: 'Evidence-based techniques for managing stress, including mindfulness practices, breathing exercises, and cognitive strategies.',
      readTime: '7 min',
      author: 'Dr. Emily Rodriguez',
      date: 'Aug 10, 2025',
      rating: 4.9,
      image: '🧠',
      tags: ['Stress Relief', 'Mindfulness', 'Mental Wellness']
    },
    {
      id: 4,
      category: 'fitness',
      title: 'High-Intensity Interval Training Benefits',
      description: 'Maximize your workout efficiency with HIIT. Learn proper techniques and how to integrate them into your routine safely.',
      readTime: '6 min',
      author: 'Coach Alex Thompson',
      date: 'Aug 8, 2025',
      rating: 4.7,
      image: '💪',
      tags: ['Exercise', 'HIIT', 'Fitness']
    },
    {
      id: 5,
      category: 'nutrition',
      title: 'Plant-Based Nutrition Essentials',
      description: 'Complete guide to plant-based eating, including nutrient timing, supplementation, and meal planning strategies.',
      readTime: '8 min',
      author: 'Dr. Lisa Park',
      date: 'Aug 5, 2025',
      rating: 4.5,
      image: '🥗',
      tags: ['Plant-Based', 'Nutrition', 'Health']
    },
    {
      id: 6,
      category: 'mental',
      title: 'Sleep Optimization for Better Health',
      description: 'Transform your sleep quality with scientifically-backed strategies for better rest, recovery, and overall well-being.',
      readTime: '5 min',
      author: 'Dr. James Wilson',
      date: 'Aug 3, 2025',
      rating: 4.8,
      image: '😴',
      tags: ['Sleep', 'Recovery', 'Performance']
    }
  ];

  const healthcareNews = [
    {
      id: 1,
      title: 'Revolutionary Gene Therapy Shows Promise for Cancer Treatment',
      description: 'Clinical trials demonstrate 85% success rate in targeting previously untreatable cancer types using personalized gene therapy approaches.',
      category: 'Breakthrough',
      date: 'Aug 20, 2025',
      readTime: '3 min',
      image: '🧬',
      trending: true
    },
    {
      id: 2,
      title: 'WHO Updates Global Mental Health Guidelines',
      description: 'New comprehensive framework addresses digital wellness, workplace mental health, and community-based intervention strategies.',
      category: 'Policy',
      date: 'Aug 18, 2025',
      readTime: '4 min',
      image: '🌍',
      trending: true
    },
    {
      id: 3,
      title: 'AI-Powered Diabetes Management System Approved',
      description: 'FDA approves first AI-driven continuous glucose monitoring system that automatically adjusts insulin delivery in real-time.',
      category: 'Technology',
      date: 'Aug 16, 2025',
      readTime: '5 min',
      image: '🤖'
    },
    {
      id: 4,
      title: 'Mediterranean Diet Reduces Alzheimer\'s Risk by 40%',
      description: 'Long-term study of 12,000 participants reveals significant cognitive protection from traditional Mediterranean eating patterns.',
      category: 'Research',
      date: 'Aug 14, 2025',
      readTime: '4 min',
      image: '🫒'
    }
  ];

  const filteredTips = activeCategory === 'all' 
    ? healthTips 
    : healthTips.filter(tip => tip.category === activeCategory);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`star ${i < Math.floor(rating) ? 'filled' : ''}`}
      />
    ));
  };

  return (
    <div className="health-tips-page">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Your Journey to <span className="hero-highlight">Optimal Health</span>
          </h1>
          <p className="hero-description">
            Discover evidence-based health insights, expert advice, and the latest medical breakthroughs 
            to transform your well-being and live your healthiest life.
          </p>
          <div className="hero-badges">
            <div className="badge">
              <Heart className="badge-icon" />
              <span>Expert-Verified</span>
            </div>
            <div className="badge">
              <TrendingUp className="badge-icon" />
              <span>Evidence-Based</span>
            </div>
            <div className="badge">
              <Clock className="badge-icon" />
              <span>Updated Daily</span>
            </div>
          </div>
        </div>
        <div className="hero-overlay"></div>
      </div>

      <div className="main-content">
        {/* Health Tips Section */}
        <section className="health-tips-section">
          <div className="section-header">
            <h2 className="section-title">Expert Health Tips & Advice</h2>
            <p className="section-description">
              Curated by medical professionals to help you make informed decisions about your health
            </p>
          </div>

          {/* Category Filter */}
          <div className="category-filter">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                >
                  <IconComponent className="category-icon" />
                  {category.name}
                </button>
              );
            })}
          </div>

          {/* Tips Grid */}
          <div className="tips-grid">
            {filteredTips.map((tip) => (
              <div
                key={tip.id}
                className={`tip-card ${tip.featured ? 'featured' : ''}`}
              >
                {tip.featured && (
                  <div className="featured-badge">
                    <Star className="featured-icon" />
                    Featured Article
                  </div>
                )}
                
                <div className="card-content">
                  <div className="card-image">{tip.image}</div>
                  
                  <div className="card-meta">
                    <div className="rating">
                      {renderStars(tip.rating)}
                      <span className="rating-value">{tip.rating}</span>
                    </div>
                    <div className="read-time">
                      <Clock className="meta-icon" />
                      {tip.readTime}
                    </div>
                  </div>

                  <h3 className="card-title">{tip.title}</h3>
                  <p className="card-description">{tip.description}</p>

                  <div className="tags">
                    {tip.tags.map((tag, index) => (
                      <span key={index} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="card-footer">
                    <div className="author-info">
                      <User className="meta-icon" />
                      <span>{tip.author}</span>
                    </div>
                    <div className="date-info">
                      <Calendar className="meta-icon" />
                      <span>{tip.date}</span>
                    </div>
                  </div>

                  <button className="read-more-btn">
                    Read Full Article
                    <ArrowRight className="btn-icon" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Healthcare News Section */}
        <section className="news-section">
          <div className="section-header">
            <h2 className="section-title">Latest Healthcare News</h2>
            <p className="section-description">
              Stay informed with the most recent developments in healthcare, research, and medical innovation
            </p>
          </div>

          <div className="news-grid">
            {healthcareNews.map((news) => (
              <div key={news.id} className="news-card">
                <div className="news-content">
                  <div className="news-header">
                    <div className="news-image">{news.image}</div>
                    <div className="news-badges">
                      {news.trending && (
                        <span className="trending-badge">
                          <TrendingUp className="trending-icon" />
                          Trending
                        </span>
                      )}
                      <span className="category-badge">
                        {news.category}
                      </span>
                    </div>
                  </div>

                  <h3 className="news-title">{news.title}</h3>
                  <p className="news-description">{news.description}</p>

                  <div className="news-footer">
                    <div className="news-meta">
                      <div className="meta-item">
                        <Calendar className="meta-icon" />
                        {news.date}
                      </div>
                      <div className="meta-item">
                        <Clock className="meta-icon" />
                        {news.readTime}
                      </div>
                    </div>
                    
                    <button className="news-read-more">
                      Read More
                      <ArrowRight className="btn-icon" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="view-all-container">
            <button className="view-all-btn">
              View All News
              <ArrowRight className="btn-icon" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HealthTipsPage;