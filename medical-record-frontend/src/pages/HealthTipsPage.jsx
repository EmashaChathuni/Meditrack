import React from "react";
import "./HealthTipsPage.css";

const HealthTipsPage = () => {
  // Example health tips and articles data
  const healthTips = [
    {
      title: "5 Tips to Improve Your Heart Health",
      description: "Learn how simple lifestyle changes can lower your risk of heart disease.",
      link: "#"
    },
    {
      title: "The Importance of Staying Hydrated",
      description: "Discover the health benefits of drinking water and staying hydrated.",
      link: "#"
    },
    {
      title: "Mental Health: Coping with Stress",
      description: "A guide to managing stress through relaxation techniques and mindfulness.",
      link: "#"
    }
  ];

  // Example healthcare news data
  const healthcareNews = [
    {
      title: "New Breakthrough in Cancer Treatment",
      description: "Researchers have developed a new method to target and destroy cancer cells.",
      link: "#"
    },
    {
      title: "World Health Organization's Latest Guidelines on COVID-19",
      description: "The WHO has updated its recommendations for COVID-19 prevention and vaccination.",
      link: "#"
    },
    {
      title: "Advancements in Diabetes Management",
      description: "New drugs and therapies are offering better control for diabetes patients.",
      link: "#"
    }
  ];

  return (
    <div className="health-tips-container">
      {/* Health Tips Section */}
      <section className="health-tips-section">
        <h2>Health Tips & Advice</h2>
        <div className="tips-list">
          {healthTips.map((tip, index) => (
            <div className="tip-card" key={index}>
              <h3>{tip.title}</h3>
              <p>{tip.description}</p>
              <a href={tip.link} className="tip-link">Read more</a>
            </div>
          ))}
        </div>
      </section>

      {/* Healthcare News Section */}
      <section className="health-news-section">
        <h2>Latest Healthcare News</h2>
        <div className="news-list">
          {healthcareNews.map((news, index) => (
            <div className="news-card" key={index}>
              <h3>{news.title}</h3>
              <p>{news.description}</p>
              <a href={news.link} className="news-link">Read more</a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HealthTipsPage;
