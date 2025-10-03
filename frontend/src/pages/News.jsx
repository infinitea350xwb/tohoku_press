import { useEffect, useState } from "react";
import { ArrowDown } from "lucide-react";
import { ArticleCard } from "../components/ArticleCard";
import { fetchArticlesByTag } from "../lib/api";

export const News = () => {
  const [articles, setArticles] = useState([]);
  
  useEffect(() => {
    const controller = new AbortController();

    fetchArticlesByTag("学生", { signal: controller.signal })
      .then((fetched) => {
        const items = Array.isArray(fetched)
          ? fetched
          : fetched?.items || [];
        setArticles(items);
      })
      .catch((error) => {
        console.error("Failed to load tagged articles", error);
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
          <h1 className="text-4xl pt-15 md:text-6xl font-bold tracking-tight">
            <span className="text-primary opacity-0 animate-fade-in-delay-1">
              {" "}
              東北大学新聞
              {" "}
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-2-2xl mx-auto opacity-0 animate-fade-in-delay-3">
            I create stellar web experiences with modern technologies.
            Specializing in front-end development, I build interfaces that are
            both beautiful and functional.
          </p>

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
