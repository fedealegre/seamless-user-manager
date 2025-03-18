
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/lib/api-service";
import { User } from "@/lib/api-types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, MoreVertical, User as UserIcon, Wallet, FileText, Lock, LockOpen, X, Eye, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

const UserManagement = () => {
  const [searchParams, setSearchParams] = useState({
    query: "",
    searchBy: "name" as "name" | "surname" | "identifier",
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [showUnblockDialog, setShowUnblockDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const { toast } = useToast();

  // Query for users
  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ["users", searchParams],
    queryFn: () => {
      const params: any = {};
      
      if (searchParams.query) {
        if (searchParams.searchBy === "name") {
          params.name = searchParams.query;
        } else if (searchParams.searchBy === "surname") {
          params.surname = searchParams.query;
        } else {
          params.identifier = searchParams.query;
        }
      }
      
      return apiService.searchUsers(params);
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      await apiService.deleteUser(selectedUser.id.toString());
      toast({
        title: "User Deleted",
        description: `User ${selectedUser.name} ${selectedUser.surname} has been deleted successfully.`,
      });
      refetch();
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setShowDeleteDialog(false);
      setSelectedUser(null);
    }
  };

  const handleBlockUser = async () => {
    if (!selectedUser) return;
    
    try {
      await apiService.blockUser(selectedUser.id.toString());
      toast({
        title: "User Blocked",
        description: `User ${selectedUser.name} ${selectedUser.surname} has been blocked.`,
      });
      refetch();
    } catch (error) {
      console.error("Failed to block user:", error);
      toast({
        title: "Error",
        description: "Failed to block user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setShowBlockDialog(false);
      setSelectedUser(null);
    }
  };

  const handleUnblockUser = async () => {
    if (!selectedUser) return;
    
    try {
      await apiService.unblockUser(selectedUser.id.toString());
      toast({
        title: "User Unblocked",
        description: `User ${selectedUser.name} ${selectedUser.surname} has been unblocked.`,
      });
      refetch();
    } catch (error) {
      console.error("Failed to unblock user:", error);
      toast({
        title: "Error",
        description: "Failed to unblock user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setShowUnblockDialog(false);
      setSelectedUser(null);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground">Manage and monitor customer accounts</p>
          </div>
          
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users..."
                className="pl-8 w-full md:w-[300px]"
                value={searchParams.query}
                onChange={(e) => setSearchParams({ ...searchParams, query: e.target.value })}
              />
            </div>
            
            <Tabs
              defaultValue="name"
              value={searchParams.searchBy}
              onValueChange={(value) => setSearchParams({ ...searchParams, searchBy: value as any })}
              className="w-[200px]"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="name">Name</TabsTrigger>
                <TabsTrigger value="surname">Surname</TabsTrigger>
                <TabsTrigger value="identifier">ID/Email</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Button type="submit">Search</Button>
          </form>
        </div>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle>Users</CardTitle>
            <CardDescription>
              {isLoading ? "Loading..." : 
                users && users.length > 0 
                  ? `${users.length} users found` 
                  : "No users found"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {Array(5).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users && users.length > 0 ? (
                      users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-muted/50 flex items-center justify-center">
                                <UserIcon size={16} />
                              </div>
                              <div>
                                <div className="font-medium">{user.name} {user.surname}</div>
                                <div className="text-sm text-muted-foreground">@{user.username}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{user.id}</div>
                            {user.publicId && <div className="text-xs text-muted-foreground">{user.publicId}</div>}
                          </TableCell>
                          <TableCell>
                            {user.email && <div className="text-sm">{user.email}</div>}
                            {user.phoneNumber && <div className="text-sm">{user.phoneNumber}</div>}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={user.status === "ACTIVE" ? "outline" : "destructive"}
                              className={user.status === "ACTIVE" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                            >
                              {user.status || (user.blocked ? "BLOCKED" : "ACTIVE")}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical size={16} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Eye size={16} className="mr-2" /> View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Wallet size={16} className="mr-2" /> View Wallets
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <FileText size={16} className="mr-2" /> Transactions
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {user.status === "ACTIVE" || !user.blocked ? (
                                  <DropdownMenuItem 
                                    onClick={() => {
                                      setSelectedUser(user);
                                      setShowBlockDialog(true);
                                    }}
                                    className="text-amber-600"
                                  >
                                    <Lock size={16} className="mr-2" /> Block User
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem 
                                    onClick={() => {
                                      setSelectedUser(user);
                                      setShowUnblockDialog(true);
                                    }}
                                    className="text-green-600"
                                  >
                                    <LockOpen size={16} className="mr-2" /> Unblock User
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem 
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setShowDeleteDialog(true);
                                  }}
                                  className="text-destructive"
                                >
                                  <X size={16} className="mr-2" /> Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No users found. Try a different search.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Delete User Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="py-4">
              <div className="flex items-center gap-3 p-3 rounded-md bg-muted/50">
                <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle size={16} className="text-destructive" />
                </div>
                <div>
                  <div className="font-medium">{selectedUser.name} {selectedUser.surname}</div>
                  <div className="text-sm text-muted-foreground">ID: {selectedUser.id}</div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Block User Dialog */}
      <Dialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Block User</DialogTitle>
            <DialogDescription>
              Are you sure you want to block this user? They will not be able to access their account.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="py-4">
              <div className="flex items-center gap-3 p-3 rounded-md bg-muted/50">
                <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <Lock size={16} className="text-amber-600" />
                </div>
                <div>
                  <div className="font-medium">{selectedUser.name} {selectedUser.surname}</div>
                  <div className="text-sm text-muted-foreground">ID: {selectedUser.id}</div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBlockDialog(false)}>
              Cancel
            </Button>
            <Button variant="default" onClick={handleBlockUser}>
              Block User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Unblock User Dialog */}
      <Dialog open={showUnblockDialog} onOpenChange={setShowUnblockDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unblock User</DialogTitle>
            <DialogDescription>
              Are you sure you want to unblock this user? They will regain access to their account.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="py-4">
              <div className="flex items-center gap-3 p-3 rounded-md bg-muted/50">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <LockOpen size={16} className="text-green-600" />
                </div>
                <div>
                  <div className="font-medium">{selectedUser.name} {selectedUser.surname}</div>
                  <div className="text-sm text-muted-foreground">ID: {selectedUser.id}</div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUnblockDialog(false)}>
              Cancel
            </Button>
            <Button variant="default" onClick={handleUnblockUser}>
              Unblock User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserManagement;
