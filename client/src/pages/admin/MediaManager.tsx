import React from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const MediaManager: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Media Manager - Admin Panel</title>
      </Helmet>
      
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Media Asset Management</h1>
        <p className="text-gray-500">Upload and manage media files for your church website.</p>
        
        <Card>
          <CardHeader>
            <CardTitle>Media Library</CardTitle>
            <CardDescription>
              This feature is coming soon. You'll be able to upload, organize, and use media assets here.
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

export default MediaManager;