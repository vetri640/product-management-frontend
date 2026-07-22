import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit, Trash2, Box, Calendar, Activity, Loader2, IndianRupee, Tag, Info, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '../../types';
import { productService } from '../../services/api';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const data = await productService.getById(id);
        setProduct(data);
      } catch (error) {
        console.error('Failed to fetch product details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    try {
      await productService.delete(id);
      navigate('/products');
    } catch (error) {
      console.error('Failed to delete product', error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
          <Box className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Product Not Found</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">The product you are looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/products')} className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 rounded-xl">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/products')} className="shrink-0 h-10 w-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">{product.name}</h2>
              <Badge className={`px-3 py-1 text-sm font-medium shadow-sm ${
                product.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 hover:bg-emerald-100' : 
                product.status === 'MAINTENANCE' ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50 hover:bg-amber-100' : 
                'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 border border-red-200 dark:border-red-800/50 hover:bg-red-100'
              }`}>
                {product.status}
              </Badge>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-2 font-medium">
              <span className="text-blue-600 dark:text-blue-400">{product.modelNumber}</span> 
              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
              <span>{product.category}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate(`/products/${product.id}/edit`)} className="h-11 px-5 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-all hover:scale-105 active:scale-95">
            <Edit className="w-4 h-4 mr-2 text-slate-500" />
            Edit Product
          </Button>
          <Button variant="destructive" onClick={() => setDeleteModalOpen(true)} className="h-11 px-5 rounded-xl bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-500/20 transition-all hover:scale-105 active:scale-95">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image Card */}
          <Card className="glass-card overflow-hidden border-slate-200/60 dark:border-slate-800/60 rounded-2xl">
            <div className="aspect-[21/9] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-blue-500/5 dark:bg-blue-500/10 mix-blend-overlay z-10"></div>
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 relative z-20" />
              ) : (
                <div className="relative z-20 flex flex-col items-center opacity-50">
                  <Box className="w-20 h-20 text-slate-400 dark:text-slate-500 mb-4" />
                  <span className="font-medium text-slate-500">No image provided</span>
                </div>
              )}
            </div>
          </Card>

          <Card className="glass-card border-slate-200/60 dark:border-slate-800/60 rounded-2xl">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 pb-5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Info className="w-5 h-5" />
                </div>
                <CardTitle className="text-xl">Basic Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div>
                <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Description</h4>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
                  {product.description || <span className="italic opacity-50">No description available.</span>}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-100 dark:border-slate-800/60">
                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800/50">
                  <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2 mb-1">
                    <Tag className="w-4 h-4" /> Category
                  </h4>
                  <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{product.category}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800/50">
                  <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2 mb-1">
                    <Box className="w-4 h-4" /> Model Number
                  </h4>
                  <p className="text-lg font-mono text-slate-900 dark:text-slate-100">{product.modelNumber}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <Card className="glass-card border-slate-200/60 dark:border-slate-800/60 rounded-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-cyan-400"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-slate-600 dark:text-slate-300">Pricing & Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
              <div>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400 block mb-1">Price per unit</span>
                <div className="flex items-center gap-1">
                  <IndianRupee className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                  <span className="text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">{product.price.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="h-px w-full bg-slate-100 dark:bg-slate-800/60" />
              
              <div>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400 block mb-2">Current Stock Level</span>
                <div className="flex items-center justify-between">
                  <span className={`text-2xl font-bold ${
                    product.stock > 10 ? 'text-emerald-500 dark:text-emerald-400' : 
                    product.stock > 0 ? 'text-amber-500 dark:text-amber-400' : 'text-red-500 dark:text-red-400'
                  }`}>
                    {product.stock} Units
                  </span>
                  {product.stock <= 10 && product.stock > 0 && (
                    <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 dark:text-amber-400 dark:border-amber-800/50 dark:bg-amber-500/10">Low Stock</Badge>
                  )}
                  {product.stock === 0 && (
                    <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50 dark:text-red-400 dark:border-red-800/50 dark:bg-red-500/10">Out of Stock</Badge>
                  )}
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mt-3 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((product.stock / 100) * 100, 100)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-2 rounded-full ${
                      product.stock > 10 ? 'bg-emerald-500' : 
                      product.stock > 0 ? 'bg-amber-500' : 'bg-red-500'
                    }`} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-slate-200/60 dark:border-slate-800/60 rounded-2xl">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/60 mb-4">
              <CardTitle className="text-lg">Product Owner</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                  {product.owner.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100 text-lg">{product.owner}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Responsible Manager</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-slate-200/60 dark:border-slate-800/60 rounded-2xl">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/60 mb-4">
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {product.activities && product.activities.length > 0 ? (
                  product.activities.map((activity, idx) => (
                    <div key={activity.id} className="relative pl-8">
                      {idx !== product.activities!.length - 1 && (
                        <div className="absolute left-[11px] top-6 bottom-[-24px] w-[2px] bg-slate-100 dark:bg-slate-800" />
                      )}
                      <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-500/10 border-2 border-white dark:border-slate-900 flex items-center justify-center z-10">
                        <Activity className="w-3 h-3 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{activity.action}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{activity.description}</p>
                        <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-slate-400 dark:text-slate-500">
                          <Calendar className="w-3.5 h-3.5" />
                          {activity.date}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <Activity className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                    <p className="text-sm text-slate-500 font-medium">No recent activity recorded.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl overflow-hidden p-0 border-0 shadow-2xl">
          <div className="bg-red-50 dark:bg-red-500/10 p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <DialogTitle className="text-xl text-red-700 dark:text-red-400">Delete Product</DialogTitle>
            <DialogDescription className="mt-2 text-red-600/80 dark:text-red-300/80">
              Are you sure you want to delete <span className="font-bold">{product.name}</span>? This action cannot be undone and all associated data will be permanently removed.
            </DialogDescription>
          </div>
          <DialogFooter className="p-4 bg-white dark:bg-slate-900 flex justify-end gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)} className="rounded-xl border-slate-200 dark:border-slate-700">
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

export default ProductDetails;
