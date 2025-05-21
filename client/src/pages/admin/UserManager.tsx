import { useState } from "react";
import { Helmet } from "react-helmet";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import { User } from "@shared/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { UserCog, Mail, Ban } from "lucide-react";

// Define user roles
const userRoles = [
  { value: "user", label: "Regular User" },
  { value: "admin", label: "Administrator" },
  { value: "volunteer", label: "Volunteer" },
  { value: "staff", label: "Staff Member" },
];

const UserManager = () => {
  const [isEditRoleDialogOpen, setIsEditRoleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch users
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  // Edit user role mutation
  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: string }) => {
      return apiRequest("PATCH", `/api/users/${userId}/role`, { role });
    },
    onSuccess: () => {
      toast({
        title: "Role Updated",
        description: "The user role has been updated successfully.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      setIsEditRoleDialogOpen(false);
      setSelectedUser(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "There was an error updating the user role. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleEditRole = (user: User) => {
    setSelectedUser(user);
    setSelectedRole(user.role);
    setIsEditRoleDialogOpen(true);
  };

  const confirmRoleUpdate = () => {
    if (selectedUser && selectedRole) {
      updateRoleMutation.mutate({ userId: selectedUser.id, role: selectedRole });
    }
  };

  // Format display name
  const getDisplayName = (user: User): string => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    } else if (user.firstName) {
      return user.firstName;
    } else {
      return user.username;
    }
  };

  // Get role badge styling
  const getRoleBadgeStyle = (role: string): string => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "staff":
        return "bg-blue-100 text-blue-800";
      case "volunteer":
        return "bg-green-100 text-green-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  // Get a count of users by role
  const getUserRoleCounts = () => {
    if (!users) return {};
    
    return users.reduce((acc: Record<string, number>, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});
  };

  const roleCounts = getUserRoleCounts();

  return (
    <>
      <Helmet>
        <title>User Management - Grace Community Church</title>
      </Helmet>

      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">User Management</h1>

        {/* Role statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))
          ) : (
            <>
              <Card>
                <CardContent className="p-4 flex flex-col items-center justify-center h-24">
                  <p className="text-sm text-slate-500">Total Users</p>
                  <p className="text-3xl font-bold">{users?.length || 0}</p>
                </CardContent>
              </Card>
              
              {userRoles.map(role => (
                <Card key={role.value}>
                  <CardContent className="p-4 flex flex-col items-center justify-center h-24">
                    <p className="text-sm text-slate-500">{role.label}s</p>
                    <p className="text-3xl font-bold">{roleCounts[role.value] || 0}</p>
                  </CardContent>
                </Card>
              )).slice(0, 3)}
            </>
          )}
        </div>

        {/* User List */}
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>
              Manage user accounts and permission levels.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array(5).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="ml-auto">
                      <Skeleton className="h-8 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : !users || users.length === 0 ? (
              <p className="text-center py-4 text-slate-500">No users found</p>
            ) : (
              <div className="rounded-md border">
                <div className="grid grid-cols-5 bg-slate-50 p-4 font-medium">
                  <div className="col-span-2">User</div>
                  <div>Email</div>
                  <div>Joined</div>
                  <div className="text-right">Role</div>
                </div>
                <div className="divide-y">
                  {users.map(user => (
                    <div key={user.id} className="grid grid-cols-5 p-4 items-center">
                      <div className="col-span-2 flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                          <span className="text-slate-600 font-medium">
                            {user.firstName?.[0] || user.username[0].toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{getDisplayName(user)}</p>
                          <p className="text-xs text-slate-500">@{user.username}</p>
                        </div>
                      </div>
                      <div className="text-sm truncate">
                        <a 
                          href={`mailto:${user.email}`} 
                          className="text-slate-600 hover:text-slate-900 flex items-center"
                        >
                          <Mail className="h-3 w-3 mr-1" />
                          {user.email}
                        </a>
                      </div>
                      <div className="text-sm text-slate-500">
                        {formatDate(user.createdAt)}
                      </div>
                      <div className="flex items-center justify-end space-x-2">
                        <Badge className={getRoleBadgeStyle(user.role)}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEditRole(user)}
                          title="Change Role"
                        >
                          <UserCog className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Role Dialog */}
        <Dialog open={isEditRoleDialogOpen} onOpenChange={setIsEditRoleDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change User Role</DialogTitle>
              <DialogDescription>
                Update the role for {selectedUser ? getDisplayName(selectedUser) : "user"}.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <span className="text-slate-600 font-medium">
                      {selectedUser?.firstName?.[0] || selectedUser?.username[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{selectedUser ? getDisplayName(selectedUser) : ""}</p>
                    <p className="text-xs text-slate-500">@{selectedUser?.username}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="role" className="text-sm font-medium">
                    Role
                  </label>
                  <Select
                    value={selectedRole}
                    onValueChange={setSelectedRole}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {userRoles.map(role => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditRoleDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={confirmRoleUpdate}
                className="bg-purple-600 hover:bg-purple-700"
                disabled={updateRoleMutation.isPending}
              >
                {updateRoleMutation.isPending ? "Updating..." : "Update Role"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default UserManager;