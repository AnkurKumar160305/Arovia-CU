function Blog() {
  const articles = [
    {
      title: "Could intermittent fasting reduce breast cancer",
      date: "2024-01-01",
      dateDisplay: "01 Jan, 2024"
    },
    {
      title: "Give children more autonomy during the pandemic",
      date: "2024-02-10",
      dateDisplay: "10 Feb, 2024"
    },
    {
      title: "How do binge eating and drinking impact the liver?",
      date: "2024-02-12",
      dateDisplay: "12 Feb, 2024"
    }
  ];

  return (
    <section className="section blog" aria-labelledby="blog-label">
      <div className="container">
        <p className="section-subtitle title-lg text-center" id="blog-label" data-reveal="bottom">
          News & Article
        </p>

        <h2 className="section-title headline-md text-center" data-reveal="bottom">
          Latest Articles
        </h2>

        <ul className="grid-list">
          {articles.map((article, index) => (
            <li key={index}>
              <div className="blog-card has-before has-after" data-reveal="bottom">
                <div className="meta-wrapper">
                  <div className="card-meta">
                    <ion-icon name="person-outline"></ion-icon>
                    <span className="span">By Admin</span>
                  </div>

                  <div className="card-meta">
                    <ion-icon name="folder-outline"></ion-icon>
                    <span className="span">Specialist {'{MrRadhaJi}'}</span>
                  </div>
                </div>

                <h3 className="headline-sm card-title">{article.title}</h3>

                <time className="title-sm date" dateTime={article.date}>
                  {article.dateDisplay}
                </time>

                <p className="card-text">
                  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut
                  labore et dolore magna aliquyam erat
                </p>

                <a href="#" className="btn-text title-lg">Read More</a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Blog;