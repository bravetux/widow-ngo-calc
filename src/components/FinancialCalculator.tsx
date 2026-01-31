import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Info, 
  AlertCircle, 
  ShieldCheck, 
  Heart, 
  PiggyBank, 
  Target, 
  Wallet,
  TrendingUp,
  CheckCircle2,
  HelpCircle
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const COLORS = ['#14B8A6', '#2DD4BF', '#99F6E4', '#F0FDFA'];

export default function FinancialCalculator() {
  // --- State ---
  const [income, setIncome] = useState<number>(100000);
  const [expenses, setExpenses] = useState<number>(40000);
  const [savings, setSavings] = useState<number>(500000);
  const [healthPremium, setHealthPremium] = useState<number>(2000);
  
  // SIP Goals
  const [goalAmount, setGoalAmount] = useState<number>(1000000);
  const [years, setYears] = useState<number>(5);
  const [expectedReturn, setExpectedReturn] = useState<number>(12);

  // --- Calculations ---
  const totalNeeds = expenses + healthPremium;
  const needsPercentage = (totalNeeds / income) * 100;
  
  // 50/30/20 Targets
  const needsTarget = income * 0.5;
  const wantsTarget = income * 0.3;
  const savingsTarget = income * 0.2;

  // Actual Allocation (for visualization)
  const actualWants = Math.max(0, income - totalNeeds - savingsTarget);
  const actualSavings = income - totalNeeds - actualWants;

  const termLifeCover = income * 12 * 20; // 20x Annual Income

  // Safety Net Logic (6 months of needs)
  const safetyNetTarget = totalNeeds * 6;
  const safetyNetProgress = Math.min((savings / safetyNetTarget) * 100, 100);
  const isSafetyNetReady = savings >= safetyNetTarget;

  // SIP Calculation: P = (FV * r) / ((1 + r)^n - 1)
  const requiredSIP = useMemo(() => {
    const r = expectedReturn / 100 / 12;
    const n = years * 12;
    if (r === 0) return goalAmount / n;
    return (goalAmount * r) / (Math.pow(1 + r, n) - 1);
  }, [goalAmount, years, expectedReturn]);

  const pieData = [
    { name: 'Needs', value: totalNeeds },
    { name: 'Wants', value: actualWants },
    { name: 'Savings', value: actualSavings },
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
          Financial Security Calculator
        </h1>
        <p className="text-lg text-teal-700/80 max-w-2xl mx-auto leading-relaxed">
          A calm space to plan your transition. We'll help you organize your monthly income 
          to ensure you and your loved ones are always protected.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-teal-100/50 shadow-xl shadow-teal-900/5 overflow-hidden">
            <div className="h-2 bg-teal-500" />
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-teal-900">
                <Wallet className="h-5 w-5 text-teal-600" /> Your Numbers
              </CardTitle>
              <CardDescription>Adjust these to see your plan update in real-time</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="income" className="text-teal-900 font-medium">Monthly Net Salary</Label>
                  <span className="text-xs font-bold text-teal-600">₹{formatCurrency(income)}</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-teal-400 font-medium z-10">₹</span>
                  <Input
                    id="income"
                    type="number"
                    className="pl-8 border-teal-100 bg-teal-50/30 focus:bg-white transition-all focus:ring-teal-500 h-11 mb-2"
                    value={income}
                    onChange={(e) => setIncome(Number(e.target.value))}
                  />
                  <Slider 
                    value={[income]} 
                    max={500000} 
                    step={1000} 
                    onValueChange={(val) => setIncome(val[0])}
                    className="py-2"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="expenses" className="text-teal-900 font-medium">Monthly Essential Expenses</Label>
                  <span className="text-xs font-bold text-teal-600">₹{formatCurrency(expenses)}</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-teal-400 font-medium z-10">₹</span>
                  <Input
                    id="expenses"
                    type="number"
                    className="pl-8 border-teal-100 bg-teal-50/30 focus:bg-white transition-all focus:ring-teal-500 h-11 mb-2"
                    value={expenses}
                    onChange={(e) => setExpenses(Number(e.target.value))}
                  />
                  <Slider 
                    value={[expenses]} 
                    max={100000} 
                    step={1000} 
                    onValueChange={(val) => setExpenses(val[0])}
                    className="py-2"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="health" className="text-teal-900 font-medium">Health Insurance Premium</Label>
                  <span className="text-xs font-bold text-teal-600">₹{formatCurrency(healthPremium)}</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-teal-400 font-medium z-10">₹</span>
                  <Input
                    id="health"
                    type="number"
                    className="pl-8 border-teal-100 bg-teal-50/30 focus:bg-white transition-all focus:ring-teal-500 h-11 mb-2"
                    value={healthPremium}
                    onChange={(e) => setHealthPremium(Number(e.target.value))}
                  />
                  <Slider 
                    value={[healthPremium]} 
                    max={20000} 
                    step={500} 
                    onValueChange={(val) => setHealthPremium(val[0])}
                    className="py-2"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="savings" className="text-teal-900 font-medium flex items-center gap-2">
                  Existing Savings/Lump Sum
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3.5 w-3.5 text-teal-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>Total accessible cash or savings accounts</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-teal-400 font-medium">₹</span>
                  <Input
                    id="savings"
                    type="number"
                    className="pl-8 border-teal-100 bg-teal-50/30 focus:bg-white transition-all focus:ring-teal-500 h-11"
                    value={savings}
                    onChange={(e) => setSavings(Number(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Safety Net Visualizer */}
          <Card className="border-teal-100/50 shadow-lg shadow-teal-900/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-teal-600 flex items-center justify-between">
                Safety Net Status
                {isSafetyNetReady ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <TrendingUp className="h-5 w-5 text-teal-400" />}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-2xl font-bold text-teal-900">₹{formatCurrency(savings)}</p>
                  <p className="text-xs text-teal-600">Current Safety Net</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-teal-800">₹{formatCurrency(safetyNetTarget)}</p>
                  <p className="text-xs text-teal-600">Goal (6 mo. Needs)</p>
                </div>
              </div>
              <Progress value={safetyNetProgress} className="h-2.5 bg-teal-50" indicatorClassName="bg-teal-500" />
              <p className="text-xs text-teal-600/80 italic leading-relaxed">
                A "Safety Net" provides peace of mind, covering 6 months of your essential needs in case of unexpected changes.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Section */}
        <div className="lg:col-span-8 space-y-8">
          {/* 50/30/20 Breakdown */}
          <Card className="border-teal-100/50 shadow-xl shadow-teal-900/5 bg-white overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl text-teal-950">The 50/30/20 Allocation</CardTitle>
                  <CardDescription>Targeting stability and growth</CardDescription>
                </div>
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-teal-900">Total Income</p>
                  <p className="text-xl font-bold text-teal-600">₹{formatCurrency(income)}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
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
                        paddingAngle={8}
                        dataKey="value"
                        animationDuration={1500}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        formatter={(value: number) => `₹${formatCurrency(value)}`}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-8">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm items-center">
                      <span className="font-semibold text-teal-900 flex items-center gap-2">
                        Needs <span className="text-xs font-normal text-teal-600">(Target 50%)</span>
                      </span>
                      <span className={`font-bold ${needsPercentage > 50 ? "text-rose-500" : "text-teal-700"}`}>
                        ₹{formatCurrency(totalNeeds)} ({needsPercentage.toFixed(1)}%)
                      </span>
                    </div>
                    <Progress value={needsPercentage} className="h-3 bg-teal-50" indicatorClassName={needsPercentage > 50 ? "bg-rose-400" : "bg-teal-500"} />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm items-center">
                      <span className="font-semibold text-teal-900 flex items-center gap-2">
                        Wants <span className="text-xs font-normal text-teal-600">(Target 30%)</span>
                      </span>
                      <span className="font-bold text-teal-600">₹{formatCurrency(actualWants)}</span>
                    </div>
                    <Progress value={(actualWants/income)*100} className="h-3 bg-teal-50" indicatorClassName="bg-teal-300" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm items-center">
                      <span className="font-semibold text-teal-900 flex items-center gap-2">
                        Savings/SIP <span className="text-xs font-normal text-teal-600">(Target 20%)</span>
                      </span>
                      <span className="font-bold text-teal-600">₹{formatCurrency(actualSavings)}</span>
                    </div>
                    <Progress value={(actualSavings/income)*100} className="h-3 bg-teal-50" indicatorClassName="bg-teal-100" />
                  </div>
                </div>
              </div>

              {needsPercentage > 50 && (
                <Alert className="mt-8 bg-rose-50 border-rose-100 text-rose-900 animate-in zoom-in-95 duration-500">
                  <AlertCircle className="h-5 w-5 text-rose-500" />
                  <AlertTitle className="font-bold text-rose-800">Gentle Suggestion: Rebalance</AlertTitle>
                  <AlertDescription className="text-rose-700 mt-1">
                    Your "Needs" currently exceed the recommended 50% threshold. Consider reviewing non-essential 
                    subscriptions or finding ways to optimize recurring costs to build a more comfortable cushion.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Insurance Engine */}
            <Card className="border-teal-100/50 shadow-lg shadow-teal-900/5 bg-gradient-to-br from-white to-teal-50/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-teal-900 text-lg">
                  <ShieldCheck className="h-5 w-5 text-teal-600" /> Protection Roadmap
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-5 rounded-2xl bg-white border border-teal-100 shadow-sm">
                  <h4 className="font-semibold text-teal-900 flex items-center gap-2 mb-2">
                    <Heart className="h-4 w-4 text-rose-400" /> Term Life Cover
                  </h4>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-teal-950">₹{formatCurrency(termLifeCover)}</span>
                  </div>
                  <p className="text-xs text-teal-600 mt-2 leading-relaxed italic">
                    Based on 20x annual income to provide lasting security for your family.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-teal-50 bg-teal-50/20">
                  <h4 className="font-medium text-teal-800 text-sm">Health Coverage Check</h4>
                  <p className="text-teal-950 font-semibold mt-1">
                    ₹{formatCurrency(healthPremium)}/mo
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    {healthPremium + expenses <= needsTarget ? (
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Within 50% Limit</span>
                    ) : (
                      <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Exceeds 50% Limit</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SIP/Goal Calculator */}
            <Card className="border-teal-100/50 shadow-lg shadow-teal-900/5 bg-teal-950 text-white overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-900/50 rounded-full -mr-16 -mt-16 blur-3xl" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-teal-100 text-lg">
                  <Target className="h-5 w-5" /> Future Aspirations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-teal-300 font-medium">Financial Goal (₹)</Label>
                    <Input 
                      type="number" 
                      value={goalAmount} 
                      onChange={(e) => setGoalAmount(Number(e.target.value))}
                      className="bg-teal-900/50 border-teal-800 text-white placeholder:text-teal-600 focus:ring-teal-400"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-teal-300 font-medium">Time Horizon (Years)</Label>
                    <Input 
                      type="number" 
                      value={years} 
                      onChange={(e) => setYears(Number(e.target.value))}
                      className="bg-teal-900/50 border-teal-800 text-white placeholder:text-teal-600 focus:ring-teal-400"
                    />
                  </div>
                </div>
                
                <div className="pt-4 border-t border-teal-800/50">
                  <h4 className="text-sm font-medium text-teal-400 flex items-center gap-2 mb-3">
                    <PiggyBank className="h-4 w-4" /> Required Monthly SIP
                  </h4>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">₹{formatCurrency(requiredSIP)}</span>
                    <span className="text-teal-500 text-sm font-medium">per month</span>
                  </div>
                  
                  <div className="mt-6 flex items-center gap-3">
                    {requiredSIP <= actualSavings ? (
                      <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Healthy: Fits in your savings bucket
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
                        <Info className="h-3.5 w-3.5" />
                        Consider extending your timeline
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <footer className="text-center pt-10 border-t border-teal-100 max-w-2xl mx-auto">
        <p className="text-teal-600/70 text-sm italic leading-relaxed">
          Remember, these numbers are a guide to help you find your footing. 
          Your journey is unique, and taking the time to plan today is a profound act of care for your tomorrow.
        </p>
      </footer>
    </div>
  );
}