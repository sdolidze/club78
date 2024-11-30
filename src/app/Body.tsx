"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {articles.map((article) => (
        <div key={article.id}>{article.name}</div>
      ))}
    </div>
  );
}
