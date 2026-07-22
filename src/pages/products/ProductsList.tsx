import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Plus, MoreHorizontal, Eye, Edit, Trash2, SlidersHorizontal, ChevronDown, Box, AlertCircle, ArrowUpDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Product } from '../../types';
import { productService } from '../../services/api';
import { Loader2 } from 'lucide-react';

const ProductsList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async () => {
    if (deleteId) {
      await productService.delete(deleteId);
      setProducts(products.filter(p => p.id !== deleteId));
      setDeleteId(null);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(search.toLowerCase()) || 
    p.modelNumber?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: Product['status']) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 hover:bg-emerald-100 shadow-sm font-medium">Active</Badge>;
      case 'MAINTENANCE':
        return <Badge className="bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50 hover:bg-amber-100 shadow-sm font-medium">Maintenance</Badge>;
      case 'INACTIVE':
        return <Badge className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 shadow-sm font-medium">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    if (!category) return <span className="text-slate-400 text-sm">-</span>;
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
        {category}
      </span>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Products</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your hardware and software products fleet.</p>
        </div>
        <Button 
          onClick={() => navigate('/products/new')}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 rounded-xl px-5 h-10 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="glass-card rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 shadow-sm overflow-hidden flex flex-col">
        {/* Table Toolbar */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800/60 flex flex-col sm:flex-row gap-4 justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="relative w-full sm:max-w-md group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <Input 
              placeholder="Search products by name or model..." 
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
            <Button variant="outline" className="h-10 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm">
              Sort by
              <ChevronDown className="w-4 h-4 ml-2 text-slate-500" />
            </Button>
          </div>
        </div>

        {/* Desktop DataGrid */}
        <div className="overflow-x-auto relative hidden md:block">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold">Product</th>
                <th scope="col" className="px-6 py-4 font-semibold">Category</th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200">
                    Price <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">Stock</th>
                <th scope="col" className="px-6 py-4 font-semibold">Status</th>
                <th scope="col" className="px-6 py-4 font-semibold">Owner</th>
                <th scope="col" className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">Loading inventory data...</p>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Box className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-4" />
                      <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">No products found</h3>
                      <p className="text-slate-500 max-w-sm mt-1">We couldn't find any products matching your search criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {filteredProducts.map((product) => (
                    <motion.tr 
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden flex-shrink-0 shadow-sm">
                            {product.imageUrl ? (
                              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                                <Box className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-slate-100">{product.name}</div>
                            <div className="text-xs text-slate-500 font-mono mt-0.5">{product.modelNumber || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getCategoryBadge(product.category || '')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-700 dark:text-slate-300">
                          ₹{product.price.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-600 dark:text-slate-400 font-medium">{product.stock || 0}</div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(product.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6 border border-slate-200 dark:border-slate-700">
                            <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 text-[10px] font-medium">
                              {product.owner ? product.owner.substring(0, 2).toUpperCase() : '?'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium text-slate-600 dark:text-slate-400 truncate max-w-[120px]" title={product.owner}>
                            {product.owner}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity">
                              <MoreHorizontal className="h-4 w-4 text-slate-500" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40 rounded-xl shadow-lg border-slate-200 dark:border-slate-800">
                            <DropdownMenuItem onClick={() => navigate(`/products/${product.id}`)} className="cursor-pointer rounded-lg">
                              <Eye className="mr-2 h-4 w-4 text-slate-500" />
                              View details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/products/${product.id}/edit`)} className="cursor-pointer rounded-lg">
                              <Edit className="mr-2 h-4 w-4 text-slate-500" />
                              Edit product
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />
                            <DropdownMenuItem 
                              onClick={() => setDeleteId(product.id)}
                              className="text-red-600 dark:text-red-400 cursor-pointer rounded-lg focus:bg-red-50 dark:focus:bg-red-500/10 focus:text-red-700 dark:focus:text-red-300"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Product Cards */}
        <div className="md:hidden flex flex-col divide-y divide-slate-100 dark:divide-slate-800">
           {loading ? (
              <div className="px-6 py-16 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">Loading inventory data...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <Box className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-4 mx-auto" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">No products found</h3>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div key={product.id} className="p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                       <div className="w-12 h-12 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden flex-shrink-0 shadow-sm">
                          {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                              <Box className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-slate-100">{product.name}</div>
                          <div className="text-xs text-slate-500 font-mono mt-0.5">{product.modelNumber || 'N/A'}</div>
                        </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                          <MoreHorizontal className="h-4 w-4 text-slate-500" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 rounded-xl">
                        <DropdownMenuItem onClick={() => navigate(`/products/${product.id}`)}>
                          <Eye className="mr-2 h-4 w-4" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/products/${product.id}/edit`)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setDeleteId(product.id)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                    <div>
                      <span className="text-slate-500">Price:</span> <span className="font-medium">₹{product.price.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Stock:</span> <span className="font-medium">{product.stock || 0}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Category:</span> {getCategoryBadge(product.category || '')}
                    </div>
                    <div>
                      <span className="text-slate-500">Status:</span> {getStatusBadge(product.status)}
                    </div>
                  </div>
                </div>
              ))
            )}
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row items-center justify-between text-sm text-slate-500 dark:text-slate-400 gap-4 mt-auto">
          <div>Showing <span className="font-medium text-slate-700 dark:text-slate-300">{filteredProducts.length}</span> results</div>
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
            <DialogTitle className="text-xl text-red-700 dark:text-red-400">Delete Product</DialogTitle>
            <DialogDescription className="mt-2 text-red-600/80 dark:text-red-300/80">
              Are you sure you want to delete this product? This action cannot be undone and will permanently remove all associated data.
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

export default ProductsList;
