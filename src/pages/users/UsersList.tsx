import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, UserCog, Search, SlidersHorizontal, Shield, Mail, Calendar, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { User } from '../../types';
import { userService } from '../../services/api';
import { Loader2 } from 'lucide-react';

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.getAll();
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch users', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async () => {
    if (deleteId) {
      await userService.delete(deleteId);
      setUsers(users.filter(u => u.id !== deleteId));
      setDeleteId(null);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-6xl mx-auto"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">User Management</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage platform administrators and regular users.</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 rounded-xl px-5 h-10 transition-all hover:scale-105 active:scale-95"
        >
          <UserCog className="w-4 h-4 mr-2" />
          Invite User
        </Button>
      </div>

      <div className="glass-card rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 shadow-sm overflow-hidden flex flex-col">
        {/* Table Toolbar */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800/60 flex flex-col sm:flex-row gap-4 justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="relative w-full sm:max-w-md group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <Input 
              placeholder="Search users by name or email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:ring-blue-500/20 rounded-xl w-full transition-all shadow-sm"
            />
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="h-10 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm">
              <SlidersHorizontal className="w-4 h-4 mr-2 text-slate-500" />
              Filters
            </Button>
          </div>
        </div>

        {/* DataGrid */}
        <div className="overflow-x-auto relative">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300 min-w-[800px]">
            <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold">User Details</th>
                <th scope="col" className="px-6 py-4 font-semibold">Contact</th>
                <th scope="col" className="px-6 py-4 font-semibold">Role</th>
                <th scope="col" className="px-6 py-4 font-semibold">Status</th>
                <th scope="col" className="px-6 py-4 font-semibold">Joined Date</th>
                <th scope="col" className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">Loading user data...</p>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                        <UserCog className="w-6 h-6 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">No users found</h3>
                      <p className="text-slate-500 max-w-sm mt-1">We couldn't find any users matching your search criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {filteredUsers.map((user) => (
                    <motion.tr 
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-10 w-10 border border-slate-200 dark:border-slate-700 shadow-sm">
                            <AvatarFallback className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-semibold text-sm">
                              {user.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-slate-100">{user.name}</div>
                            <div className="text-xs text-slate-500">ID: {user.id.substring(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-slate-600 dark:text-slate-400">
                          <Mail className="w-4 h-4 mr-2 text-slate-400" />
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {user.role === 'ADMIN' ? (
                          <div className="flex items-center text-purple-700 dark:text-purple-400 font-medium">
                            <Shield className="w-4 h-4 mr-1.5" />
                            Admin
                          </div>
                        ) : (
                          <div className="flex items-center text-slate-600 dark:text-slate-400 font-medium">
                            <UserCog className="w-4 h-4 mr-1.5" />
                            User
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={`font-medium shadow-sm ${
                          user.status === 'ACTIVE' 
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 hover:bg-emerald-100' 
                            : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 border border-red-200 dark:border-red-800/50 hover:bg-red-100'
                        }`}>
                          {user.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                          {user.createdDate}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => setDeleteId(user.id)}
                            className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row items-center justify-between text-sm text-slate-500 dark:text-slate-400 gap-4 mt-auto">
          <div>Showing <span className="font-medium text-slate-700 dark:text-slate-300">{filteredUsers.length}</span> users</div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled className="h-9 rounded-lg">Previous</Button>
            <Button variant="outline" size="sm" disabled className="h-9 rounded-lg">Next</Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl overflow-hidden p-0 border-0 shadow-2xl">
          <div className="bg-red-50 dark:bg-red-500/10 p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <DialogTitle className="text-xl text-red-700 dark:text-red-400">Delete User</DialogTitle>
            <DialogDescription className="mt-2 text-red-600/80 dark:text-red-300/80">
              Are you sure you want to delete this user? This action cannot be undone and they will lose access to the platform.
            </DialogDescription>
          </div>
          <DialogFooter className="p-4 bg-white dark:bg-slate-900 flex justify-end gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setDeleteId(null)} className="rounded-xl border-slate-200 dark:border-slate-700">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} className="rounded-xl shadow-md shadow-red-500/20">
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default UsersList;
