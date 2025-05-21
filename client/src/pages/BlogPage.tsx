import { useState } from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { BlogPost } from "@shared/schema";
import { motion } from "framer-motion";
import { formatDate, truncateText } from "@/lib/utils";
import { blogCategories } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";

const BlogPage = () => {
  const { data: blogPosts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts"],
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter published posts
  const publishedPosts = blogPosts?.filter((post) => post.isPublished) || [];

  // Extract unique categories
  const categories = publishedPosts
    ? Array.from(new Set(publishedPosts.map((post) => post.category)))
    : [];

  // Filter posts by search term and category
  const filteredPosts = publishedPosts.filter((post) => {
    const searchMatch = searchTerm
      ? post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    
    const categoryMatch = selectedCategory
      ? post.category === selectedCategory
      : true;
    
    return searchMatch && categoryMatch;
  });

  // Get category name from ID
  const getCategoryName = (categoryId: string) => {
    const category = blogCategories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  return (
    <>
      <Helmet>
        <title>Blog & News - Grace Community Church</title>
        <meta
          name="description"
          content="Stay updated with the latest happenings, devotionals, testimonies, and news from Grace Community Church."
        />
      </Helmet>

      <main>
        {/* Hero Section */}
        <section className="relative bg-slate-900 text-white py-20">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/70">
            <img
              src="https://pixabay.com/get/g138436146bb9203ee81ec26458c5d0513a0e5d2a488932bdd27e2b6dc7a42ebc5710e34725e32d1d926dc2d2583a77625fddc5dabb2a140f8f2ea8c192b4925b_1280.jpg"
              alt="Church community"
              className="w-full h-full object-cover mix-blend-overlay"
            />
          </div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog & News</h1>
              <p className="text-xl max-w-3xl mx-auto">
                Stay updated with the latest happenings in our church community,
                devotionals, testimonies, and inspiring stories.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Blog Posts Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left Sidebar - Search and Filters */}
              <div className="md:w-1/3 lg:w-1/4 space-y-8">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search blog posts..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Category Filter */}
                <div className="border rounded-md p-4">
                  <h3 className="font-semibold mb-3">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center">
                        <input
                          type="radio"
                          id={category}
                          name="category"
                          className="mr-2"
                          checked={selectedCategory === category}
                          onChange={() => setSelectedCategory(category)}
                        />
                        <label htmlFor={category}>{getCategoryName(category)}</label>
                      </div>
                    ))}
                  </div>
                  {selectedCategory && (
                    <Button
                      variant="link"
                      onClick={() => setSelectedCategory(null)}
                      className="mt-2 p-0 h-auto text-sm text-purple-600"
                    >
                      Clear category filter
                    </Button>
                  )}
                </div>

                {/* Recent Posts */}
                <div className="border rounded-md p-4">
                  <h3 className="font-semibold mb-3">Recent Posts</h3>
                  {isLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex gap-3">
                          <Skeleton className="h-14 w-14 rounded-md flex-shrink-0" />
                          <div className="space-y-1 flex-grow">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-3 w-2/3" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {publishedPosts.slice(0, 3).map((post) => (
                        <div key={post.id} className="flex gap-3">
                          {post.imageUrl ? (
                            <img
                              src={post.imageUrl}
                              alt={post.title}
                              className="h-14 w-14 rounded-md object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="h-14 w-14 rounded-md bg-slate-200 flex items-center justify-center flex-shrink-0">
                              <i className="fas fa-newspaper text-slate-400"></i>
                            </div>
                          )}
                          <div>
                            <h4 className="font-medium text-sm line-clamp-2">{post.title}</h4>
                            <p className="text-xs text-slate-500">{formatDate(post.publishDate)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Content - Blog Posts */}
              <div className="md:w-2/3 lg:w-3/4">
                {isLoading ? (
                  <BlogPostsLoading />
                ) : (
                  <Tabs defaultValue="all" className="w-full">
                    <TabsList className="mb-6">
                      <TabsTrigger value="all">All Posts</TabsTrigger>
                      <TabsTrigger value="news">Church News</TabsTrigger>
                      <TabsTrigger value="devotional">Devotionals</TabsTrigger>
                    </TabsList>
                    <TabsContent value="all">
                      <BlogPostsList posts={filteredPosts} />
                    </TabsContent>
                    <TabsContent value="news">
                      <BlogPostsList 
                        posts={filteredPosts.filter(post => post.category === 'news')} 
                      />
                    </TabsContent>
                    <TabsContent value="devotional">
                      <BlogPostsList 
                        posts={filteredPosts.filter(post => post.category === 'devotional')}
                      />
                    </TabsContent>
                  </Tabs>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

const BlogPostsList = ({ posts }: { posts: BlogPost[] }) => {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-md">
        <h3 className="text-xl font-medium text-slate-800 mb-2">
          No blog posts found
        </h3>
        <p className="text-slate-600">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {posts.map((post) => (
        <BlogPostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

const BlogPostCard = ({ post }: { post: BlogPost }) => {
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
            <i className="far fa-calendar mr-1"></i> {formatDate(post.publishDate)}
          </span>
          <span>
            <i className="far fa-user mr-1"></i> {post.author}
          </span>
        </div>
        <h3 className="text-xl font-bold mb-2">{post.title}</h3>
        <p className="text-slate-700 mb-4">
          {truncateText(post.content, 150)}
        </p>
        <div className="flex justify-between items-center">
          <a
            href={`/blog/${post.id}`}
            className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium transition-colors"
          >
            Read More
            <i className="fas fa-arrow-right ml-2"></i>
          </a>
          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
            {post.category}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const BlogPostsLoading = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
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
            <div className="flex justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-6 w-16 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlogPage;
