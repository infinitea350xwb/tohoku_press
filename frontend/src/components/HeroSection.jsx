import { useEffect, useState } from "react";
import { ArrowDown } from "lucide-react";
import { ArticleCard } from "./ArticleCard";
import { fetchArticles } from "../lib/api";

export const HeroSection = () => {
  // for fetching latest articles
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    fetchArticles({ signal: controller.signal })
      .then((fetched) => {
        setArticles(Array.isArray(fetched) ? fetched : []);
      })
      .catch((error) => {
        console.error("Failed to load latest articles", error);
      });

    return () => controller.abort();
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-4"
    >
      <div className="container max-w-4xl mx-auto text-center z-10">
        <div className="space-y-6">
          <div className="pt-4 opacity-0 animate-fade-in-delay-4">
            <a href="#projects" className="banner-line">
              新着記事
            </a>
          </div>

          <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.slice(0, 6).map((article, index) => {
              const published = article?.publishedAt || article?.createdAt;
              const date = published
                ? new Date(published).toLocaleDateString('ja-JP')
                : undefined;

              return (
                <ArticleCard
                  key={article?._id || article?.slug || index}
                  category={index === 0 ? 'Latest' : 'Highlights'}
                  title={article?.title || '記事タイトル'}
                  date={date}
                  body={
                    article?.excerpt ||
                    (article?.contentHtml
                      ? article.contentHtml.replace(/<[^>]+>/g, '').slice(0, 120) + '…'
                      : '最新の記事を準備中です。')
                  }
                  href={article ? `/post/${article.slug || article._id}` : '#'}
                  image={article?.coverUrl || (index === 1 ? '/images/bushitsu.jpg' : undefined)}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce">
        <span className="text-sm text-muted-foreground mb-2"> Scroll </span>
        <ArrowDown className="h-5 w-5 text-primary" />
      </div>
    </section>
  );
};
