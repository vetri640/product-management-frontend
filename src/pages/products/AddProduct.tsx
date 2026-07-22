import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, UploadCloud, Loader2, X, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { productService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ProductStatus } from '../../types';

const CATEGORIES = ['Drone', 'GPS Module', 'IoT Device', 'Camera', 'Battery', 'Software'];

const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const processFile = (file: File) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

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
    setLoading(true);
    try {
      const createdProduct = await productService.create({
        name: formData.name,
        category: formData.category,
        modelNumber: formData.modelNumber,
        description: formData.description,
        price: Number(formData.price),
        stock: Number(formData.stock),
        status: formData.status,
        owner: user?.name || 'Unknown',
      });
      
      if (imageFile && createdProduct.id) {
        await productService.uploadImage(createdProduct.id, imageFile);
      }
      
      navigate('/products');
    } catch (error) {
      console.error('Failed to create product', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-8"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/products')} className="shrink-0 h-10 w-10 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800">
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Add New Product</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Configure product details, inventory, and pricing.</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <Button type="button" variant="ghost" onClick={() => navigate('/products')} className="rounded-xl">
            Discard
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 rounded-xl px-6 h-10 transition-all hover:scale-105 active:scale-95"
            disabled={loading}
          >
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {loading ? 'Saving...' : 'Save Product'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column: Form Details */}
        <div className="xl:col-span-2 space-y-6">
          <Card className="glass-card border-0 shadow-sm ring-1 ring-slate-200/50 dark:ring-slate-800/50 bg-white dark:bg-slate-900">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 pb-4">
              <CardTitle className="text-lg font-semibold">General Information</CardTitle>
              <CardDescription>Primary details about your hardware or software.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              
              <div className="space-y-2 group">
                <Label htmlFor="name" className="text-slate-600 dark:text-slate-300 group-focus-within:text-blue-600 transition-colors">Product Name *</Label>
                <Input 
                  id="name" name="name" required
                  value={formData.name} onChange={handleChange}
                  placeholder="e.g. Zuppa Autonomous Drone X2"
                  className="h-12 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl focus-visible:ring-blue-500/20 transition-all text-base"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2 group">
                  <Label htmlFor="category" className="text-slate-600 dark:text-slate-300 group-focus-within:text-blue-600 transition-colors">Category *</Label>
                  <Select value={formData.category} onValueChange={(val) => handleSelectChange('category', val)} required>
                    <SelectTrigger className="h-12 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl focus:ring-blue-500/20 text-base">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800">
                      {CATEGORIES.map(c => <SelectItem key={c} value={c} className="rounded-lg">{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2 group">
                  <Label htmlFor="modelNumber" className="text-slate-600 dark:text-slate-300 group-focus-within:text-blue-600 transition-colors">Model Number *</Label>
                  <Input 
                    id="modelNumber" name="modelNumber" required
                    value={formData.modelNumber} onChange={handleChange}
                    placeholder="e.g. ZDX2-002"
                    className="h-12 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl focus-visible:ring-blue-500/20 transition-all text-base font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <Label htmlFor="description" className="text-slate-600 dark:text-slate-300 group-focus-within:text-blue-600 transition-colors">Description</Label>
                <textarea 
                  id="description" name="description"
                  value={formData.description} onChange={handleChange}
                  className="flex min-h-[140px] w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all resize-y"
                  placeholder="Provide a detailed description of the product features and specifications..."
                />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-0 shadow-sm ring-1 ring-slate-200/50 dark:ring-slate-800/50 bg-white dark:bg-slate-900">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 pb-4">
              <CardTitle className="text-lg font-semibold">Pricing & Inventory</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2 group">
                  <Label htmlFor="price" className="text-slate-600 dark:text-slate-300 group-focus-within:text-blue-600 transition-colors">Price (INR) *</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
                    <Input 
                      id="price" name="price" type="number" min="0" step="0.01" required
                      value={formData.price} onChange={handleChange}
                      placeholder="0.00"
                      className="pl-8 h-12 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl focus-visible:ring-blue-500/20 transition-all text-base font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-2 group">
                  <Label htmlFor="stock" className="text-slate-600 dark:text-slate-300 group-focus-within:text-blue-600 transition-colors">Stock Quantity *</Label>
                  <Input 
                    id="stock" name="stock" type="number" min="0" required
                    value={formData.stock} onChange={handleChange}
                    placeholder="0"
                    className="h-12 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl focus-visible:ring-blue-500/20 transition-all text-base"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Media & Status */}
        <div className="space-y-6">
          <Card className="glass-card border-0 shadow-sm ring-1 ring-slate-200/50 dark:ring-slate-800/50 bg-white dark:bg-slate-900 overflow-hidden">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 pb-4 bg-slate-50/50 dark:bg-slate-900/50">
              <CardTitle className="text-lg font-semibold flex items-center">
                <ImageIcon className="w-5 h-5 mr-2 text-slate-400" />
                Product Media
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div 
                className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 group ${
                  isDragging 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10' 
                    : imagePreview 
                      ? 'border-transparent p-0 overflow-hidden h-[240px]' 
                      : 'border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !imagePreview && fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <div className="w-full h-full relative group/preview">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover/preview:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
                      <CheckCircle2 className="w-10 h-10 text-emerald-400 mb-2" />
                      <div className="flex gap-2">
                        <Button type="button" variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }} className="rounded-lg h-9">
                          Replace
                        </Button>
                        <Button type="button" variant="destructive" size="sm" onClick={clearImage} className="rounded-lg h-9">
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <motion.div 
                    initial={false}
                    animate={{ scale: isDragging ? 1.05 : 1 }}
                    className="flex flex-col items-center pointer-events-none"
                  >
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors ${isDragging ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                      <UploadCloud className="w-7 h-7" />
                    </div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {isDragging ? 'Drop image here' : 'Click or drag image to upload'}
                    </p>
                    <p className="text-xs text-slate-500 mt-2 max-w-[200px]">
                      SVG, PNG, JPG or GIF (max. 5MB)
                    </p>
                  </motion.div>
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

          <Card className="glass-card border-0 shadow-sm ring-1 ring-slate-200/50 dark:ring-slate-800/50 bg-white dark:bg-slate-900">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 pb-4">
              <CardTitle className="text-lg font-semibold">Visibility</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-2 group">
                  <Label className="text-slate-600 dark:text-slate-300">Status</Label>
                  <Select value={formData.status} onValueChange={(val) => handleSelectChange('status', val)}>
                    <SelectTrigger className="h-12 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl focus:ring-blue-500/20 text-base">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800">
                      <SelectItem value="ACTIVE" className="rounded-lg">
                        <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-2" /> Active</div>
                      </SelectItem>
                      <SelectItem value="INACTIVE" className="rounded-lg">
                        <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-slate-500 mr-2" /> Inactive</div>
                      </SelectItem>
                      <SelectItem value="MAINTENANCE" className="rounded-lg">
                        <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-amber-500 mr-2" /> Maintenance</div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  This product will be visible immediately across the platform based on the selected status.
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Mobile Actions */}
          <div className="flex sm:hidden justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => navigate('/products')} className="flex-1 rounded-xl h-12">
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 rounded-xl h-12"
              disabled={loading}
            >
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default AddProduct;
