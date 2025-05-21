import React from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const BlogManager: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Blog Posts - Admin Panel</title>
      </Helmet>
      
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Blog Management</h1>
        <p className="text-gray-500">Create and manage blog posts for your church website.</p>
        
        <Card>
          <CardHeader>
            <CardTitle>Blog Posts</CardTitle>
            <CardDescription>
              This feature is coming soon. You'll be able to create, edit, and publish blog posts here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-8 text-center text-gray-500">
              <p>This feature is under development.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default BlogManager;