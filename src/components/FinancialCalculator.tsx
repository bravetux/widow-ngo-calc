import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  ShieldCheck, 
  Heart, 
  Target, 
  Wallet,
  TrendingUp,
  CheckCircle2,
  Umbrella,
  Coins,
  Banknote,
  LineChart as LineChartIcon
} from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip, 
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

const COLORS = ['#14B8A6', '#2DD4BF', '#F59E0B', '#10B981', '#E2E8F0'];

export default function FinancialCalculator() {
  // --- State ---
  const [income, setIncome] = useState<number>(50000);
  const [expenses, setExpenses] = useState<number>(20000);
  const [healthPremium, setHealthPremium] = useState<number>(1000);
  const [termPremium, setTermPremium] = useState<number>(500);
  const [monthlySIP, setMonthlySIP] = useState<number>(5000);
  const [fdAmount, setFdAmount] = useState<number>(2000);
  
  const [savings, setSavings] = useState<number>(100000); // Existing corpus
  const [years, setYears] = useState<number>(10);
  const [expectedReturn, setExpectedReturn] = useState<number>(12);

  // --- Calculations ---
  const totalNeeds = expenses + healthPremium + termPremium;
  const availablePool = Math.max(0, income - totalNeeds);

  // Ensure SIP + FD don't exceed available pool
  useEffect(() => {
    if (monthlySIP > availablePool) {
      setMonthlySIP(availablePool);
    }
    if (fdAmount > availablePool - monthlySIP) {
      setFdAmount(Math.max(0, availablePool - monthlySIP));
    }
  }, [availablePool, monthlySIP]);

  const finalBalance = availablePool - monthlySIP - fdAmount;
  
  const termLifeCover = income * 12 * 20;
  const safetyNetTarget = totalNeeds * 6;
  const safetyNetProgress = Math.min((savings / safetyNetTarget) * 100, 100);
  const isSafetyNetReady = savings >= safetyNetTarget;

  // Data for the line graph showing wealth growth over years (SIP + FD growth)
  const wealthGrowthData = useMemo(() => {
    const data = [];
    const rSIP = expectedReturn / 100 / 12;
    const rFD = 0.06 / 12; // Standard 6% for FD
    
    for (let i = 0; i <= years; i++) {
      const n = i * 12;
      let sipWealth = 0;
      let fdWealth = 0;
      
      if (rSIP === 0) sipWealth = monthlySIP * n;
      else sipWealth = monthlySIP * ((Math.pow(1 + rSIP, n) - 1) / rSIP) * (1 + rSIP);
      
      if (rFD === 0) fdWealth = fdAmount * n;
      else fdWealth = fdAmount * ((Math.pow(1 + rFD, n) - 1) / rFD) * (1 + rFD);

      data.push({
        year: `Yr ${i}`,
        wealth: Math.round(sipWealth + fdWealth),
      });
    }
    return data;
  }, [monthlySIP, fdAmount, years, expectedReturn]);

  const totalWealth = wealthGrowthData[wealthGrowthData.length - 1].wealth;

  const pieData = [
    { name: 'Needs', value: totalNeeds },
    { name: 'SIP', value: monthlySIP },
    { name: 'FD', value: fdAmount },
    { name: 'Balance', value: finalBalance },
  ];

  const formatCurrency = (val: number) => {
    return val.toLocaleString('en-IN', {
      maximumFractionDigits: 0,
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <header className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-sm font-medium border border-teal-100 mb-2">
          <ShieldCheck className="h-4 w-4" /> Secure Your Future
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-teal-950">
          Personal Budget Planner
        </h1>
        <p className="text-lg text-teal-700/80 max-w-2xl mx-auto leading-relaxed">
          Allocate your income across essentials, insurance, and investments to see your financial future take shape.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-teal-100/50 shadow-xl shadow-teal-900/5 overflow-hidden">
            <div className="h-2 bg-teal-500" />
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-teal-900">
                <Wallet className="h-5 w-5 text-teal-600" /> Financial Inputs
              </CardTitle>
              <CardDescription>Adjust your monthly flows</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Income */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-teal-900 font-medium">Monthly Net Salary</Label>
                  <span className="text-xs font-bold text-teal-600">₹{formatCurrency(income)}</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-teal-400 font-medium z-10">₹</span>
                  <Input
                    type="number"
                    className="pl-8 border-teal-100 bg-teal-50/30 h-10 mb-2"
                    value={income}
                    onChange={(e) => setIncome(Math.min(50000, Number(e.target.value)))}
                  />
                  <Slider value={[income]} max={50000} step={1000} onValueChange={(val) => setIncome(val[0])} />
                </div>
              </div>

              {/* Expenses */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-teal-900 font-medium">Essential Expenses</Label>
                  <span className="text-xs font-bold text-teal-600">₹{formatCurrency(expenses)}</span>
                </div>
                <Slider value={[expenses]} max={income} step={1000} onValueChange={(val) => setExpenses(val[0])} />
              </div>

              {/* Insurance */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label className="text-xs font-medium text-teal-700">Health Prem.</Label>
                  <div className="relative">
                    <span className="absolute left-2 top-2 text-[10px] text-teal-400 z-10">₹</span>
                    <Input 
                      type="number" 
                      value={healthPremium} 
                      onChange={(e) => setHealthPremium(Number(e.target.value))}
                      className="pl-5 h-8 text-xs border-teal-100"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-medium text-teal-700">Term Prem.</Label>
                  <div className="relative">
                    <span className="absolute left-2 top-2 text-[10px] text-teal-400 z-10">₹</span>
                    <Input 
                      type="number" 
                      value={termPremium} 
                      onChange={(e) => setTermPremium(Number(e.target.value))}
                      className="pl-5 h-8 text-xs border-teal-100"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-teal-50 space-y-6">
                <div className="flex justify-between items-center mb-2">
                  <Label className="text-teal-900 font-bold text-sm">Investments & Savings</Label>
                  <div className="text-right">
                    <p className="text-[10px] text-teal-500 uppercase">Available Pool</p>
                    <p className="text-sm font-bold text-teal-700">₹{formatCurrency(availablePool)}</p>
                  </div>
                </div>

                {/* SIP Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs font-medium flex items-center gap-1.5">
                      <Target className="h-3.5 w-3.5 text-teal-600" /> Monthly SIP
                    </Label>
                    <span className="text-xs font-bold text-teal-600">₹{formatCurrency(monthlySIP)}</span>
                  </div>
                  <Slider 
                    value={[monthlySIP]} 
                    max={availablePool} 
                    step={500} 
                    onValueChange={(val) => setMonthlySIP(val[0])} 
                    className="[&_[role=slider]]:bg-teal-600"
                  />
                </div>

                {/* FD Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs font-medium flex items-center gap-1.5">
                      <Coins className="h-3.5 w-3.5 text-amber-500" /> Monthly FD
                    </Label>
                    <span className="text-xs font-bold text-amber-600">₹{formatCurrency(fdAmount)}</span>
                  </div>
                  <Slider 
                    value={[fdAmount]} 
                    max={Math.max(0, availablePool - monthlySIP)} 
                    step={500} 
                    onValueChange={(val) => setFdAmount(val[0])} 
                    className="[&_[role=slider]]:bg-amber-500"
                  />
                </div>
              </div>

              {/* Balance Display */}
              <div className="p-4 rounded-xl bg-teal-950 text-white flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-teal-400 font-medium uppercase">Final Balance</p>
                  <p className="text-xl font-bold">₹{formatCurrency(finalBalance)}</p>
                </div>
                <Banknote className="h-6 w-6 text-teal-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-teal-100/50 shadow-lg shadow-teal-900/5 bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase text-teal-600">Safety Net Coverage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end mb-2">
                <span className="text-xl font-bold text-teal-900">₹{formatCurrency(savings)}</span>
                <span className="text-xs text-teal-500">Goal: ₹{formatCurrency(safetyNetTarget)}</span>
              </div>
              <Progress value={safetyNetProgress} className="h-2 bg-teal-50" indicatorClassName="bg-teal-500" />
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Section */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="border-teal-100/50 shadow-xl shadow-teal-900/5 bg-white overflow-hidden">
            <CardHeader>
              <CardTitle className="text-2xl text-teal-950">Income Allocation</CardTitle>
              <CardDescription>Breakdown of your monthly ₹{formatCurrency(income)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        animationDuration={1000}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip formatter={(value: number) => `₹${formatCurrency(value)}`} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="space-y-6">
                  <div className="p-4 rounded-xl border border-teal-50 bg-teal-50/20">
                    <h4 className="text-sm font-semibold text-teal-900 flex items-center gap-2 mb-4">
                      <Target className="h-4 w-4 text-teal-600" /> Wealth Projection
                    </h4>
                    <div className="space-y-4">
                      <div className="flex justify-between text-xs">
                        <span className="text-teal-600">Target Years</span>
                        <div className="flex items-center gap-4 w-1/2">
                          <Slider value={[years]} min={1} max={30} step={1} onValueChange={(val) => setYears(val[0])} />
                          <span className="font-bold text-teal-900 w-8">{years}y</span>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-teal-600">SIP Return (%)</span>
                        <div className="flex items-center gap-4 w-1/2">
                          <Slider value={[expectedReturn]} min={1} max={25} step={0.5} onValueChange={(val) => setExpectedReturn(val[0])} />
                          <span className="font-bold text-teal-900 w-8">{expectedReturn}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Growth Chart */}
              <div className="space-y-4 pt-6 border-t border-teal-50">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-teal-900 flex items-center gap-2">
                    <LineChartIcon className="h-5 w-5 text-teal-600" /> Growth (SIP + FD)
                  </h3>
                  <div className="text-right">
                    <p className="text-xs text-teal-600">Wealth after {years} years</p>
                    <p className="text-xl font-bold text-emerald-600">₹{formatCurrency(totalWealth)}</p>
                  </div>
                </div>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={wealthGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0fdfa" />
                      <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#0d9488', fontSize: 11 }} />
                      <YAxis hide />
                      <RechartsTooltip 
                        formatter={(value: number) => [`₹${formatCurrency(value)}`, 'Wealth']}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                      <Line type="monotone" dataKey="wealth" stroke="#0d9488" strokeWidth={3} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-teal-100/50 shadow-lg shadow-teal-900/5 bg-gradient-to-br from-white to-teal-50/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-teal-900 text-lg">
                <Umbrella className="h-5 w-5 text-teal-600" /> Protection Benchmark
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-5 rounded-2xl bg-white border border-teal-100 shadow-sm flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-teal-900 flex items-center gap-2 mb-1">
                    <Heart className="h-4 w-4 text-rose-400" /> Recommended Term Life Cover
                  </h4>
                  <p className="text-xs text-teal-600 italic">Target: 20x Annual Income</p>
                </div>
                <span className="text-2xl font-bold text-teal-950">₹{formatCurrency(termLifeCover)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}