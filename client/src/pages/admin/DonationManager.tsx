import React from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const DonationManager: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Donations - Admin Panel</title>
      </Helmet>
      
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Donation Management</h1>
        <p className="text-gray-500">Manage and track donations to your church.</p>
        
        <Card>
          <CardHeader>
            <CardTitle>Donations Overview</CardTitle>
            <CardDescription>
              This feature is coming soon. You'll be able to view and manage all donations here.
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

export default DonationManager;