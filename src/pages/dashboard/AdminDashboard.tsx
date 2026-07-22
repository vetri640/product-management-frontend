import React, { useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Box, Users, Activity, Settings2, ArrowUpRight, ArrowDownRight, Loader2, Package, Tag, Clock, Monitor } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { productService, userService } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';

const COLORS = ['#2563EB', '#6366F1', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];

// Animated Counter Component
const AnimatedCounter = ({ value }: { value: number }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;
    
    let totalDuration = 1000;
    let incrementTime = (totalDuration / end) * 2;
    if(incrementTime > 50) incrementTime = 50;
    
    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) clearInterval(timer);
    }, incrementTime);
    
    return () => clearInterval(timer);
  }, [value]);

  return <span>{count}</span>;
};

const AdminDashboard: React.FC = () => {

  const { user: currentUser } = useAuth();
  const { theme, setTheme } = useTheme();

  const { data: products = [], isLoading: isProductsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: productService.getAll
  });

  const { data: users = [], isLoading: isUsersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
    enabled: currentUser?.role === 'ADMIN'
  });

  const isLoading = isProductsLoading || (currentUser?.role === 'ADMIN' && isUsersLoading);

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalUsers = users.length;
    const activeProducts = products.filter(p => p.status === 'ACTIVE').length;
    const maintenanceProducts = products.filter(p => p.status === 'MAINTENANCE').length;
    
    // Calculate total inventory value
    const inventoryValue = products.reduce((sum, p) => sum + (p.price * (p.stock || 0)), 0);

    const baseStats = [
      { title: 'Total Products', value: totalProducts, prefix: '', icon: Box, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10', trend: '+12.5%', isPositive: true },
      { title: 'Active Products', value: activeProducts, prefix: '', icon: Activity, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10', trend: '+18.1%', isPositive: true },
      { title: 'Maintenance', value: maintenanceProducts, prefix: '', icon: Settings2, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10', trend: '-2.4%', isPositive: false },
      { title: 'Inventory Value', value: inventoryValue, prefix: '₹', icon: Tag, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-500/10', trend: '+8.2%', isPositive: true },
    ];

    if (currentUser?.role === 'ADMIN') {
      baseStats.splice(1, 0, { title: 'Total Users', value: totalUsers, prefix: '', icon: Users, color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-500/10', trend: '+5.2%', isPositive: true });
    }

    return baseStats;
  }, [products, users, currentUser]);

  const categoryData = useMemo(() => {
    const map = new Map<string, number>();
    products.forEach(p => {
      const cat = p.category || 'Uncategorized';
      map.set(cat, (map.get(cat) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [products]);

  const timelineData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const map = new Map<string, number>();
    
    const now = new Date();
    for(let i=5; i>=0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      map.set(months[d.getMonth()], 0);
    }

    products.forEach(p => {
      if(p.createdDate) {
        const d = new Date(p.createdDate);
        const m = months[d.getMonth()];
        if(map.has(m)) {
          map.set(m, map.get(m)! + 1);
        }
      }
    });
    
    return Array.from(map.entries()).map(([name, products]) => ({ name, products }));
  }, [products]);

  const recentActivities = useMemo(() => {
    const sorted = [...products].sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()).slice(0, 5);
    return sorted.map((p) => ({
      id: p.id,
      action: 'New Product Registered',
      desc: p.name,
      category: p.category || 'Uncategorized',
      time: p.createdDate,
    }));
  }, [products]);

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          <p className="text-slate-500 font-medium animate-pulse">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring" as any, stiffness: 300, damping: 24 } 
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Overview</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Here's what's happening with your platform today.</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.title} variants={itemVariants}>
              <Card className="glass-card overflow-hidden group relative border-0 shadow-sm ring-1 ring-slate-200/50 dark:ring-slate-800/50 bg-white dark:bg-slate-900">
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/0 dark:from-white/5 dark:to-white/0 pointer-events-none" />
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}>
                      <Icon className="w-6 h-6" strokeWidth={1.5} />
                    </div>
                    <div className={`flex items-center space-x-1 text-sm font-medium px-2 py-1 rounded-full ${
                      stat.isPositive ? 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10' : 'text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-500/10'
                    }`}>
                      {stat.isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                      <span>{stat.trend}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{stat.title}</h3>
                    <div className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-baseline gap-1">
                      {stat.prefix && <span className="text-2xl text-slate-400">{stat.prefix}</span>}
                      <AnimatedCounter value={stat.value} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Timeline Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="glass-card h-full border-0 shadow-sm ring-1 ring-slate-200/50 dark:ring-slate-800/50 bg-white dark:bg-slate-900">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 pb-4">
              <CardTitle className="text-lg font-semibold">Growth Timeline</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 pb-2 pl-0">
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timelineData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorProducts" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" strokeOpacity={0.3} dark-stroke="#334155" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dx={-10} allowDecimals={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(51, 65, 85, 0.5)', borderRadius: '12px', color: '#f8fafc', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                      itemStyle={{ color: '#60a5fa', fontWeight: 500 }}
                      cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="products" 
                      stroke="#2563EB" 
                      strokeWidth={3} 
                      dot={{ r: 4, fill: '#ffffff', stroke: '#2563EB', strokeWidth: 2 }} 
                      activeDot={{ r: 6, fill: '#2563EB', stroke: '#ffffff', strokeWidth: 2 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Category Donut Chart */}
        <motion.div variants={itemVariants}>
          <Card className="glass-card h-full border-0 shadow-sm ring-1 ring-slate-200/50 dark:ring-slate-800/50 bg-white dark:bg-slate-900 flex flex-col">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 pb-4">
              <CardTitle className="text-lg font-semibold">Distribution</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center pt-6">
              {categoryData.length > 0 ? (
                <div className="h-[260px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                        cornerRadius={6}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(51, 65, 85, 0.5)', borderRadius: '12px', color: '#f8fafc' }}
                        itemStyle={{ fontWeight: 500 }}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={40} 
                        iconType="circle" 
                        formatter={(value) => <span className="text-slate-600 dark:text-slate-300 font-medium ml-1">{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 h-full space-y-3">
                  <Package className="w-12 h-12 opacity-20" />
                  <p>No product data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activities */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="glass-card h-full border-0 shadow-sm ring-1 ring-slate-200/50 dark:ring-slate-800/50 bg-white dark:bg-slate-900">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 pb-4">
              <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {recentActivities.length > 0 ? recentActivities.map((activity, index) => (
                  <motion.div 
                    key={activity.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + (index * 0.1) }}
                    className="p-4 sm:px-6 flex items-start hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <div className="relative mt-1">
                      <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 ring-4 ring-white dark:ring-slate-900 z-10">
                        <Box className="w-5 h-5" />
                      </div>
                      {index !== recentActivities.length - 1 && (
                        <div className="absolute top-10 left-1/2 -ml-px w-px h-12 bg-slate-200 dark:bg-slate-700" />
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{activity.action}</h4>
                        <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mt-1 sm:mt-0">
                          <Clock className="w-3.5 h-3.5 mr-1" />
                          {new Date(activity.time).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <div className="mt-1 flex items-center text-sm text-slate-500 dark:text-slate-400">
                        <span className="font-medium text-slate-700 dark:text-slate-300 mr-2">{activity.desc}</span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300">
                          {activity.category}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )) : (
                  <div className="p-8 text-center text-slate-500">
                    No activity found in the system.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Theme Settings */}
        <motion.div variants={itemVariants}>
          <Card className="glass-card h-full border-0 shadow-sm ring-1 ring-slate-200/50 dark:ring-slate-800/50 bg-white dark:bg-slate-900 flex flex-col">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 pb-5 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center">
                  <Monitor className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">Appearance</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6 flex-1">
              <div className="space-y-4">
                <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Theme Preference</div>
                <div className="grid grid-cols-1 gap-3">
                  <button 
                    onClick={() => setTheme('light')}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${theme === 'light' ? 'border-blue-500 bg-blue-50/50 dark:border-blue-500/50 dark:bg-blue-500/10' : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                  >
                    <span className={`font-medium ${theme === 'light' ? 'text-blue-700 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>Light Theme</span>
                    <div className={`w-4 h-4 rounded-full border-2 ${theme === 'light' ? 'border-blue-600 flex items-center justify-center' : 'border-slate-300 dark:border-slate-600'}`}>
                      {theme === 'light' && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => setTheme('dark')}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${theme === 'dark' ? 'border-blue-500 bg-blue-50/50 dark:border-blue-500/50 dark:bg-blue-500/10' : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                  >
                    <span className={`font-medium ${theme === 'dark' ? 'text-blue-700 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>Dark Theme</span>
                    <div className={`w-4 h-4 rounded-full border-2 ${theme === 'dark' ? 'border-blue-600 flex items-center justify-center' : 'border-slate-300 dark:border-slate-600'}`}>
                      {theme === 'dark' && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => setTheme('system')}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${theme === 'system' ? 'border-blue-500 bg-blue-50/50 dark:border-blue-500/50 dark:bg-blue-500/10' : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                  >
                    <span className={`font-medium ${theme === 'system' ? 'text-blue-700 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>System Sync</span>
                    <div className={`w-4 h-4 rounded-full border-2 ${theme === 'system' ? 'border-blue-600 flex items-center justify-center' : 'border-slate-300 dark:border-slate-600'}`}>
                      {theme === 'system' && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                    </div>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;

