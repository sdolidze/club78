"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { formatDistanceToNow } from "date-fns";
import { ka } from "date-fns/locale";

interface Article {
  id: number;
  date: string;
  description: string;
  imageUrl: string;
  name: string;
  type: string;
  url: string;
  created_at: string;
}

function List({ articles }: { articles: Article[] }) {
  const articleTypeMap: Record<string, string> = {
    Company: "კომპანია",
    Embassy: "საელჩო",
    Government: "მთავრობა",
    Education: "განათლება",
  };

  return (
    <ul role="list" className="divide-y divide-gray-100 mt-2">
      {articles.map((article) => (
        <li key={article.id}>
          <a
            href={article.url}
            className="flex justify-between gap-x-6 py-5 px-2 hover:bg-gray-100"
          >
            <div className="flex min-w-0 gap-x-4">
              <img
                alt=""
                src={article.imageUrl}
                className="size-12 flex-none rounded bg-gray-50"
              />
              <div className="min-w-0 flex-auto">
                <p className="text-sm/6 font-semibold text-gray-900">
                  {article.name}
                </p>
                <p className="mt-1 truncate text-xs/5 text-gray-500">
                  {article.description}
                </p>
              </div>
            </div>
            <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
              <p className="text-sm/6 text-gray-900">
                {articleTypeMap[article.type]}
              </p>
              <p className="mt-1 text-xs/5 text-gray-500">
                {formatDistanceToNow(article.date, {
                  addSuffix: true,
                  locale: ka,
                })}
              </p>
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}

function ListCard({ articles }: { articles: Article[] }) {
  return articles.map((article) => (
    <div
      key={article.id}
      className="max-w-sm rounded overflow-hidden shadow-lg"
    >
      <img className="w-full" src={article.imageUrl} alt={article.name} />
      <div className="px-6 py-4">
        <div className="font-bold text-gray-900 text-xl mb-2">
          {article.name}
        </div>
        <p className="text-gray-700 text-base">{article.description}</p>
      </div>
      <div className="px-6 pt-4 pb-2">
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          {article.type}
        </span>
      </div>
    </div>
  ));
}

export default function Body() {
  const [loading, setLoading] = useState<boolean>(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<null | unknown>(null);

  useEffect(() => {
    Promise.resolve().then(async () => {
      setLoading(true);

      const { data, error } = await supabase.from("articles").select("*");

      setLoading(false);

      if (error) {
        setError(error);
        return;
      }

      if (data === null) {
        setError({ text: "no data" });
        return;
      }

      setArticles(data);
    });
  }, []);

  if (error) {
    return <div>Something went wrong</div>;
  }

  if (loading || articles.length === 0) {
    return <div>Loading...</div>;
  }

  const companyArticles = articles.filter((a) => a.type == "Company");
  const embassyArticles = articles.filter((a) => a.type == "Embassy");
  const governmentArticles = articles.filter((a) => a.type == "Government");
  const educationArticles = articles.filter((a) => a.type == "Education");

  return (
    <div className="container mx-auto">
      {companyArticles.length > 0 && (
        <section id="companies">
          <h2 className="text-l font-semibold text-gray-900 my-2">
            კომპანიები ({companyArticles.length})
          </h2>
          <List articles={companyArticles} />
        </section>
      )}

      {embassyArticles.length > 0 && (
        <section id="embassies">
          <h2 className="text-l font-semibold text-gray-900 my-2">
            საელჩოები ({embassyArticles.length})
          </h2>
          <List articles={embassyArticles} />
        </section>
      )}

      {governmentArticles.length > 0 && (
        <section id="government">
          <h2 className="text-l font-semibold text-gray-900 my-2">
            მთავრობა ({governmentArticles.length})
          </h2>
          <List articles={governmentArticles} />
        </section>
      )}

      {educationArticles.length > 0 && (
        <section id="education">
          <h2 className="text-l font-semibold text-gray-900 my-2">
            განათლება ({educationArticles.length})
          </h2>
          <List articles={educationArticles} />
        </section>
      )}
    </div>
  );
}
