import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Upload, Loader2, X, Image as ImageIcon, Box, Tag, DollarSign, Package, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { productService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ProductStatus } from '../../types';

const CATEGORIES = ['Drone', 'GPS Module', 'IoT Device', 'Camera', 'Battery', 'Software'];

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    modelNumber: '',
    description: '',
    price: '',
    stock: '',
    status: 'ACTIVE' as ProductStatus,
  });

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const product = await productService.getById(id);
        setFormData({
          name: product.name,
          category: product.category || '',
          modelNumber: product.modelNumber || '',
          description: product.description || '',
          price: product.price.toString(),
          stock: (product.stock || 0).toString(),
          status: product.status || 'ACTIVE',
        });
        if (product.imageUrl) {
          setImagePreview(product.imageUrl);
        }
      } catch (error) {
        console.error('Failed to fetch product details', error);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setLoading(true);
    try {
      await productService.update(id, {
        name: formData.name,
        category: formData.category,
        modelNumber: formData.modelNumber,
        description: formData.description,
        price: Number(formData.price),
        stock: Number(formData.stock),
        status: formData.status,
      });
      
      if (imageFile) {
        await productService.uploadImage(id, imageFile);
      }
      
      navigate(`/products/${id}`);
    } catch (error) {
      console.error('Failed to update product', error);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-8"
    >
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(`/products/${id}`)} className="shrink-0 h-10 w-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
          <ArrowLeft className="w-5 h-5 text-slate-500" />
        </Button>
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Edit Product</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Update your product details and inventory.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="glass-card border-slate-200/60 dark:border-slate-800/60 rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 pb-5 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <Box className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Basic Information</CardTitle>
                    <CardDescription>Product identity and categorization.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-2 group">
                  <Label htmlFor="name" className="text-slate-600 dark:text-slate-300 group-focus-within:text-blue-600 transition-colors">Product Name <span className="text-red-500">*</span></Label>
                  <Input 
                    id="name" name="name" required
                    value={formData.name} onChange={handleChange}
                    placeholder="e.g. Zuppa Drone X2"
                    className="h-11 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-blue-500/20 text-slate-900 dark:text-slate-100 rounded-xl transition-all shadow-sm"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2 group">
                    <Label htmlFor="category" className="text-slate-600 dark:text-slate-300 group-focus-within:text-blue-600 transition-colors flex items-center gap-2">
                      <Tag className="w-4 h-4" /> Category <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.category} onValueChange={(val) => handleSelectChange('category', val)} required>
                      <SelectTrigger className="h-11 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:ring-blue-500/20 rounded-xl shadow-sm">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800 shadow-xl">
                        {CATEGORIES.map(c => <SelectItem key={c} value={c} className="rounded-lg cursor-pointer focus:bg-blue-50 dark:focus:bg-blue-900/30">{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2 group">
                    <Label htmlFor="modelNumber" className="text-slate-600 dark:text-slate-300 group-focus-within:text-blue-600 transition-colors flex items-center gap-2">
                      <Box className="w-4 h-4" /> Model Number <span className="text-red-500">*</span>
                    </Label>
                    <Input 
                      id="modelNumber" name="modelNumber" required
                      value={formData.modelNumber} onChange={handleChange}
                      placeholder="e.g. ZDX2-002"
                      className="h-11 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-blue-500/20 text-slate-900 dark:text-slate-100 rounded-xl transition-all shadow-sm font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2 group">
                  <Label htmlFor="description" className="text-slate-600 dark:text-slate-300 group-focus-within:text-blue-600 transition-colors">Description</Label>
                  <textarea 
                    id="description" name="description"
                    value={formData.description} onChange={handleChange}
                    className="flex min-h-[140px] w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-3 text-slate-900 dark:text-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20 transition-all shadow-sm resize-y"
                    placeholder="Provide a detailed description of the product, its features, and specifications..."
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-slate-200/60 dark:border-slate-800/60 rounded-2xl overflow-hidden relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-400 to-cyan-400"></div>
              <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 pb-5 pl-8 bg-slate-50/50 dark:bg-slate-900/50">
                <div>
                  <CardTitle className="text-xl">Pricing & Inventory</CardTitle>
                  <CardDescription>Set the financial and stock details.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-6 pl-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2 group">
                    <Label htmlFor="price" className="text-slate-600 dark:text-slate-300 group-focus-within:text-blue-600 transition-colors flex items-center gap-2">
                      <DollarSign className="w-4 h-4" /> Price (INR) <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</div>
                      <Input 
                        id="price" name="price" type="number" min="0" step="0.01" required
                        value={formData.price} onChange={handleChange}
                        placeholder="0.00"
                        className="pl-8 h-11 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-blue-500/20 text-slate-900 dark:text-slate-100 rounded-xl transition-all shadow-sm text-lg font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 group">
                    <Label htmlFor="stock" className="text-slate-600 dark:text-slate-300 group-focus-within:text-blue-600 transition-colors flex items-center gap-2">
                      <Package className="w-4 h-4" /> Stock Quantity <span className="text-red-500">*</span>
                    </Label>
                    <Input 
                      id="stock" name="stock" type="number" min="0" required
                      value={formData.stock} onChange={handleChange}
                      placeholder="0"
                      className="h-11 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-blue-500/20 text-slate-900 dark:text-slate-100 rounded-xl transition-all shadow-sm text-lg font-medium"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="glass-card border-slate-200/60 dark:border-slate-800/60 rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 pb-4 bg-slate-50/50 dark:bg-slate-900/50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-500" />
                  Product Status
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Label className="text-slate-600 dark:text-slate-300">Visibility & State</Label>
                  <Select value={formData.status} onValueChange={(val) => handleSelectChange('status', val)}>
                    <SelectTrigger className="h-11 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:ring-blue-500/20 rounded-xl shadow-sm">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800 shadow-xl">
                      <SelectItem value="ACTIVE" className="cursor-pointer focus:bg-emerald-50 dark:focus:bg-emerald-500/20 focus:text-emerald-700 dark:focus:text-emerald-400">Active (Visible)</SelectItem>
                      <SelectItem value="INACTIVE" className="cursor-pointer focus:bg-slate-100 dark:focus:bg-slate-800 focus:text-slate-700 dark:focus:text-slate-300">Inactive (Hidden)</SelectItem>
                      <SelectItem value="MAINTENANCE" className="cursor-pointer focus:bg-amber-50 dark:focus:bg-amber-500/20 focus:text-amber-700 dark:focus:text-amber-400">Maintenance (Disabled)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-slate-200/60 dark:border-slate-800/60 rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 pb-4 bg-slate-50/50 dark:bg-slate-900/50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-indigo-500" />
                  Product Media
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div 
                  className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 relative overflow-hidden group ${
                    imagePreview ? 'border-transparent p-0 aspect-video' : 'border-slate-300 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 dark:hover:border-blue-500/50'
                  }`}
                  onClick={() => !imagePreview && fileInputRef.current?.click()}
                >
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Button 
                          type="button" 
                          variant="destructive" 
                          onClick={clearImage}
                          className="bg-red-500 hover:bg-red-600 rounded-xl shadow-lg"
                        >
                          <X className="w-4 h-4 mr-2" /> Remove Image
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center pointer-events-none">
                      <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-4 text-blue-500 group-hover:scale-110 transition-transform">
                        <Upload className="w-8 h-8" />
                      </div>
                      <p className="text-base font-semibold text-slate-700 dark:text-slate-200 mb-1">Upload an image</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 px-4">Drag and drop or click to browse</p>
                      <div className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
                        SVG, PNG, JPG (max. 5MB)
                      </div>
                    </div>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end items-center gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => navigate(`/products/${id}`)}
            className="h-12 px-6 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium transition-colors"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 rounded-xl text-base font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
            disabled={loading}
          >
            {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
            {loading ? 'Saving Changes...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default EditProduct;
