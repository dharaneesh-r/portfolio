import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, image, url }) => {
  const defaultTitle = "Dharaneesh R | Full-Stack Engineer";
  const defaultDescription = "Portfolio of Dharaneesh R, a Full-Stack Engineer building scalable web experiences with modern technologies.";
  const defaultImage = "/profile.jpg"; // Using the profile picture as default OG image
  const defaultUrl = "https://dharaneeshr.vercel.app"; // Fallback URL, assuming a generic one

  const seo = {
    title: title || defaultTitle,
    description: description || defaultDescription,
    image: image || defaultImage,
    url: url || defaultUrl,
  };

  return (
    <Helmet>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={seo.url} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={seo.url} />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />
      
      {/* Schema.org Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Dharaneesh R",
          "url": "https://dharaneeshr.vercel.app",
          "image": "https://dharaneeshr.vercel.app/profile.jpg",
          "jobTitle": "Full-Stack Engineer",
          "description": "Portfolio of Dharaneesh R, a Full-Stack Engineer building scalable web experiences with modern technologies.",
          "sameAs": [
            "https://github.com/dharaneesh-r",
            "https://linkedin.com/in/dharaneesh-r"
          ]
        })}
      </script>
    </Helmet>
  );
};

export default SEO;
