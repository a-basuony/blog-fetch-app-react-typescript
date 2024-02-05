import { ReactNode, useEffect, useState } from "react";

import BlogPosts, { BlogPost } from "./components/BlogPosts";
import get from "./components/get";
import fetchingImg from "./assets/data-fetching.png";
import ErrorMessage from "./components/ErrorMessage";

type RawDataBlogPost = {
  id: number;
  useId: number;
  title: string;
  body: string;
};

function App() {
  const [fetchedData, setFetchedData] = useState<BlogPost[]>();
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string>();

  // Inside the App component
  useEffect(() => {
    async function getFetchedData() {
      setIsFetching(true);
      try {
        const data = (await get(
          "https://jsonplaceholder.typicode.com/posts"
        )) as RawDataBlogPost[];
        const blogPosts: BlogPost[] = data.map((rawPost) => ({
          id: rawPost.id,
          title: rawPost.title,
          text: rawPost.body,
        }));
        setFetchedData(blogPosts);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
      } finally {
        setIsFetching(false);
      }
    }

    getFetchedData();
  }, []);

  let content: ReactNode;

  if (fetchedData) {
    content = <BlogPosts posts={fetchedData} />;
  } else if (isFetching) {
    content = <p id="loading-fallback">Fetching posts...</p>;
  } else if (error) {
    content = <ErrorMessage text={error} />;
  }

  return (
    <main>
      <img src={fetchingImg} alt="fetching posts" />

      {content}
    </main>
  );
}

export default App;
