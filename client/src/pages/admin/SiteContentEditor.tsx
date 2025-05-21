import React from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const SiteContentEditor: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Site Content - Admin Panel</title>
      </Helmet>
      
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Site Content Management</h1>
        <p className="text-gray-500">Edit and manage content displayed across the website.</p>
        
        <Card>
          <CardHeader>
            <CardTitle>Website Content</CardTitle>
            <CardDescription>
              This feature is coming soon. You'll be able to edit all website content sections here.
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

export default SiteContentEditor;