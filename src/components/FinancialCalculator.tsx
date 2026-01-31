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
  HelpCircle,
  BarChart3
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
  const savingsTarget = income * 0.2;

  // Actual Allocation
  const actualWants = Math.max(0, income - totalNeeds - savingsTarget);
  const actualSavings = income - totalNeeds - actualWants;

  const termLifeCover = income * 12 * 20;

  // Safety Net Logic
  const safetyNetTarget = totalNeeds * 6;
  const safetyNetProgress = Math.min((savings / safetyNetTarget) * 100, 100);
  const isSafetyNetReady = savings >= safetyNetTarget;

  // SIP Formula for Required Monthly Investment: P = (FV * r) / ((1 + r)^n - 1)
  const requiredSIP = useMemo(() => {
    const r = expectedReturn / 100 / 12;
    const n = years * 12;
    if (r === 0) return goalAmount / n;
    return (goalAmount * r) / (Math.pow(1 + r, n) - 1);
  }, [goalAmount, years, expectedReturn]);

  // Total Wealth if investing the actual savings bucket
  const totalWealth = useMemo(() => {
    const r = expectedReturn / 100 / 12;
    const n = years * 12;
    if (r === 0) return actualSavings * n;
    return actualSavings * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  }, [actualSavings, years, expectedReturn]);

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
                  <Slider value={[income]} max={500000} step={1000} onValueChange={(val) => setIncome(val[0])} />
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
                  <Slider value={[expenses]} max={100000} step={1000} onValueChange={(val) => setExpenses(val[0])} />
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
                  <Slider value={[healthPremium]} max={20000} step={500} onValueChange={(val) => setHealthPremium(val[0])} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="savings" className="text-teal-900 font-medium flex items-center gap-2">
                  Existing Savings/Lump Sum
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
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Section */}
        <div className="lg:col-span-8 space-y-8">
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
                      <RechartsTooltip formatter={(value: number) => `₹${formatCurrency(value)}`} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-8">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm items-center">
                      <span className="font-semibold text-teal-900">Needs (Target 50%)</span>
                      <span className={`font-bold ${needsPercentage > 50 ? "text-rose-500" : "text-teal-700"}`}>
                        ₹{formatCurrency(totalNeeds)} ({needsPercentage.toFixed(1)}%)
                      </span>
                    </div>
                    <Progress value={needsPercentage} className="h-3 bg-teal-50" indicatorClassName={needsPercentage > 50 ? "bg-rose-400" : "bg-teal-500"} />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm items-center">
                      <span className="font-semibold text-teal-900">Wants (Target 30%)</span>
                      <span className="font-bold text-teal-600">₹{formatCurrency(actualWants)}</span>
                    </div>
                    <Progress value={(actualWants/income)*100} className="h-3 bg-teal-50" indicatorClassName="bg-teal-300" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm items-center">
                      <span className="font-semibold text-teal-900">Savings/SIP (Target 20%)</span>
                      <span className="font-bold text-teal-600">₹{formatCurrency(actualSavings)}</span>
                    </div>
                    <Progress value={(actualSavings/income)*100} className="h-3 bg-teal-50" indicatorClassName="bg-teal-100" />
                  </div>
                </div>
              </div>

              {needsPercentage > 50 && (
                <Alert className="mt-8 bg-rose-50 border-rose-100 text-rose-900">
                  <AlertCircle className="h-5 w-5 text-rose-500" />
                  <AlertTitle className="font-bold text-rose-800">Gentle Suggestion: Rebalance</AlertTitle>
                  <AlertDescription className="text-rose-700 mt-1">
                    Your "Needs" currently exceed the recommended 50% threshold.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                  <span className="text-3xl font-bold text-teal-950">₹{formatCurrency(termLifeCover)}</span>
                  <p className="text-xs text-teal-600 mt-2 italic leading-relaxed">
                    Based on 20x annual income for lasting security.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-teal-100/50 shadow-lg shadow-teal-900/5 bg-teal-950 text-white overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-teal-100 text-lg">
                  <Target className="h-5 w-5" /> SIP & Wealth Projection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-teal-300">Financial Goal (₹)</Label>
                      <Input 
                        type="number" 
                        value={goalAmount} 
                        onChange={(e) => setGoalAmount(Number(e.target.value))}
                        className="bg-teal-900/50 border-teal-800 text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-teal-300">Target (Years)</Label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold w-8">{years}</span>
                        <Slider value={[years]} min={1} max={30} step={1} onValueChange={(val) => setYears(val[0])} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs text-teal-300">Expected Annual Return (%)</Label>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold w-10">{expectedReturn}%</span>
                      <Slider value={[expectedReturn]} min={1} max={25} step={0.5} onValueChange={(val) => setExpectedReturn(val[0])} />
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-teal-800/50 space-y-4">
                  <div>
                    <h4 className="text-xs font-medium text-teal-400 flex items-center gap-2 mb-1">
                      <PiggyBank className="h-3.5 w-3.5" /> Required Monthly SIP
                    </h4>
                    <span className="text-2xl font-bold text-white">₹{formatCurrency(requiredSIP)}</span>
                  </div>

                  <div className="bg-teal-900/40 p-3 rounded-lg border border-teal-800/50">
                    <h4 className="text-xs font-medium text-teal-300 flex items-center gap-2 mb-1">
                      <BarChart3 className="h-3.5 w-3.5" /> Projected Wealth
                    </h4>
                    <span className="text-2xl font-bold text-emerald-400">₹{formatCurrency(totalWealth)}</span>
                    <p className="text-[10px] text-teal-400 mt-1 italic">
                      Estimate based on your current ₹{formatCurrency(actualSavings)} monthly savings bucket.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}