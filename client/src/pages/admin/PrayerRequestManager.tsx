import React from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const PrayerRequestManager: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Prayer Requests - Admin Panel</title>
      </Helmet>
      
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Prayer Request Management</h1>
        <p className="text-gray-500">Manage prayer requests submitted by church members and visitors.</p>
        
        <Card>
          <CardHeader>
            <CardTitle>Prayer Requests</CardTitle>
            <CardDescription>
              This feature is coming soon. You'll be able to view, answer, and manage prayer requests here.
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

export default PrayerRequestManager;