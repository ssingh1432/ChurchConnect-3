import React from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const UserManager: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>User Management - Admin Panel</title>
      </Helmet>
      
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-gray-500">Manage user accounts and permissions.</p>
        
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>
              This feature is coming soon. You'll be able to manage user accounts and roles here.
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

export default UserManager;