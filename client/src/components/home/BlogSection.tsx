import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { BlogPost } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { formatDate, truncateText } from "@/lib/utils";

const BlogSection = () => {
  const { data: blogPosts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts"],
  });

  if (isLoading) {
    return <BlogLoading />;
  }

  // Filter published posts and take 3
  const publishedPosts = blogPosts
    ?.filter((post) => post.isPublished)
    .slice(0, 3) || [];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Blog & News</h2>
          <p className="text-slate-600 max-w-3xl mx-auto">
            Stay updated with the latest happenings in our church community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {publishedPosts.length > 0 ? (
            publishedPosts.map((post) => <BlogCard key={post.id} post={post} />)
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-slate-600">No blog posts available at this time.</p>
            </div>
          )}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/blog"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md font-medium transition-colors inline-block"
          >
            View All Posts
          </Link>
        </div>
      </div>
    </section>
  );
};

const BlogCard = ({ post }: { post: BlogPost }) => {
  const publishDate = new Date(post.publishDate);

  return (
    <motion.div
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <div className="flex items-center text-sm text-slate-500 mb-3">
          <span className="mr-4">
            <i className="far fa-calendar mr-1"></i> {formatDate(publishDate)}
          </span>
          <span>
            <i className="far fa-user mr-1"></i> {post.author}
          </span>
        </div>
        <h3 className="text-xl font-bold mb-2">{post.title}</h3>
        <p className="text-slate-700 mb-4">
          {truncateText(post.content, 100)}
        </p>
        <Link
          href={`/blog/${post.id}`}
          className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium transition-colors"
        >
          Read More
          <i className="fas fa-arrow-right ml-2"></i>
        </Link>
      </div>
    </motion.div>
  );
};

const BlogLoading = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Blog & News</h2>
          <p className="text-slate-600 max-w-3xl mx-auto">
            Stay updated with the latest happenings in our church community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md">
              <Skeleton className="w-full h-48" />
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <Skeleton className="h-4 w-32 mr-4" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-6 w-4/5 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
