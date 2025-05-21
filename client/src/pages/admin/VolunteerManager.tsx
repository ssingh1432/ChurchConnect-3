import React from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const VolunteerManager: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Volunteer Management - Admin Panel</title>
      </Helmet>
      
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Volunteer Management</h1>
        <p className="text-gray-500">Manage volunteer applications and assignments for church ministries.</p>
        
        <Card>
          <CardHeader>
            <CardTitle>Volunteer Applications</CardTitle>
            <CardDescription>
              This feature is coming soon. You'll be able to review and approve volunteer applications here.
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

export default VolunteerManager;