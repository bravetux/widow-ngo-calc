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
  BarChart3,
  LineChart as LineChartIcon,
  Umbrella
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

const COLORS = ['#14B8A6', '#2DD4BF', '#99F6E4', '#CCFBF1'];

export default function FinancialCalculator() {
  // --- State ---
  const [income, setIncome] = useState<number>(50000);
  const [expenses, setExpenses] = useState<number>(20000);
  const [savings, setSavings] = useState<number>(100000);
  const [healthPremium, setHealthPremium] = useState<number>(1000);
  const [termPremium, setTermPremium] = useState<number>(500);
  
  // SIP Goals
  const [goalAmount, setGoalAmount] = useState<number>(1000000);
  const [years, setYears] = useState<number>(10);
  const [expectedReturn, setExpectedReturn] = useState<number>(12);
  const [monthlySIP, setMonthlySIP] = useState<number>(5000);

  // --- Calculations ---
  const totalNeeds = expenses + healthPremium + termPremium;
  const needsPercentage = (totalNeeds / income) * 100;
  
  // 50/30/20 Targets
  const savingsTarget = income * 0.2;

  // Actual Allocation (Calculated from remaining income)
  const actualWants = Math.max(0, income - totalNeeds - savingsTarget);
  const actualSavingsBucket = income - totalNeeds - actualWants;

  const termLifeCover = income * 12 * 20;

  // Safety Net Logic
  const safetyNetTarget = totalNeeds * 6;
  const safetyNetProgress = Math.min((savings / safetyNetTarget) * 100, 100);
  const isSafetyNetReady = savings >= safetyNetTarget;

  // SIP Formula for Required Monthly Investment
  const requiredSIP = useMemo(() => {
    const r = expectedReturn / 100 / 12;
    const n = years * 12;
    if (r === 0) return goalAmount / n;
    return (goalAmount * r) / (Math.pow(1 + r, n) - 1);
  }, [goalAmount, years, expectedReturn]);

  // Data for the line graph showing wealth growth over years
  const wealthGrowthData = useMemo(() => {
    const data = [];
    const r = expectedReturn / 100 / 12;
    
    for (let i = 0; i <= years; i++) {
      const n = i * 12;
      let currentWealth = 0;
      if (r === 0) {
        currentWealth = monthlySIP * n;
      } else {
        currentWealth = monthlySIP * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
      }
      data.push({
        year: `Yr ${i}`,
        wealth: Math.round(currentWealth),
      });
    }
    return data;
  }, [monthlySIP, years, expectedReturn]);

  const totalWealth = wealthGrowthData[wealthGrowthData.length - 1].wealth;

  const pieData = [
    { name: 'Needs', value: totalNeeds },
    { name: 'Wants', value: actualWants },
    { name: 'Savings Bucket', value: actualSavingsBucket },
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
                    onChange={(e) => setIncome(Math.min(50000, Number(e.target.value)))}
                  />
                  <Slider value={[income]} max={50000} step={1000} onValueChange={(val) => setIncome(val[0])} />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="expenses" className="text-teal-900 font-medium">Essential Expenses</Label>
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
                  <Slider value={[expenses]} max={income} step={1000} onValueChange={(val) => setExpenses(val[0])} />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="health" className="text-teal-900 font-medium">Health Premium</Label>
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
                  <Slider value={[healthPremium]} max={10000} step={500} onValueChange={(val) => setHealthPremium(val[0])} />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="term" className="text-teal-900 font-medium flex items-center gap-1.5">
                    <Umbrella className="h-3.5 w-3.5" /> Term Premium
                  </Label>
                  <span className="text-xs font-bold text-teal-600">₹{formatCurrency(termPremium)}</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-teal-400 font-medium z-10">₹</span>
                  <Input
                    id="term"
                    type="number"
                    className="pl-8 border-teal-100 bg-teal-50/30 focus:bg-white transition-all focus:ring-teal-500 h-11 mb-2"
                    value={termPremium}
                    onChange={(e) => setTermPremium(Number(e.target.value))}
                  />
                  <Slider value={[termPremium]} max={5000} step={100} onValueChange={(val) => setTermPremium(val[0])} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="savings" className="text-teal-900 font-medium">
                  Existing Savings
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
                  <CardTitle className="text-2xl text-teal-950">Allocation & Growth</CardTitle>
                  <CardDescription>Visualizing your wealth journey</CardDescription>
                </div>
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-teal-900">Total Income</p>
                  <p className="text-xl font-bold text-teal-600">₹{formatCurrency(income)}</p>
                </div>
              </div>
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
                <div className="space-y-6">
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
                      <span className="font-semibold text-teal-900">Savings Bucket (Target 20%)</span>
                      <span className="font-bold text-teal-600">₹{formatCurrency(actualSavingsBucket)}</span>
                    </div>
                    <Progress value={(actualSavingsBucket/income)*100} className="h-3 bg-teal-50" indicatorClassName="bg-teal-100" />
                  </div>
                </div>
              </div>

              {/* Wealth Growth Line Chart */}
              <div className="space-y-4 pt-6 border-t border-teal-50">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-teal-900 flex items-center gap-2">
                    <LineChartIcon className="h-5 w-5 text-teal-600" /> Projected Wealth Growth
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
                      <XAxis 
                        dataKey="year" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#0d9488', fontSize: 12 }} 
                      />
                      <YAxis 
                        hide 
                        domain={[0, 'auto']} 
                      />
                      <RechartsTooltip 
                        formatter={(value: number) => [`₹${formatCurrency(value)}`, 'Wealth']}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="wealth" 
                        stroke="#0d9488" 
                        strokeWidth={3} 
                        dot={{ r: 4, fill: '#0d9488', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 6, fill: '#0d9488' }}
                        animationDuration={2000}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
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
                    Target coverage based on 20x annual income.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-teal-100/50 shadow-lg shadow-teal-900/5 bg-teal-950 text-white overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-teal-100 text-lg">
                  <Target className="h-5 w-5" /> SIP Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="text-xs text-teal-300">Monthly SIP Investment (₹)</Label>
                      <span className="text-xs font-bold text-teal-100">₹{formatCurrency(monthlySIP)}</span>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-teal-500 font-medium z-10">₹</span>
                      <Input 
                        type="number" 
                        value={monthlySIP} 
                        onChange={(e) => setMonthlySIP(Number(e.target.value))}
                        className="pl-8 bg-teal-900/50 border-teal-800 text-white mb-2"
                      />
                      <Slider 
                        value={[monthlySIP]} 
                        max={income} 
                        step={500} 
                        onValueChange={(val) => setMonthlySIP(val[0])} 
                      />
                    </div>
                    {monthlySIP > actualSavingsBucket && (
                      <p className="text-[10px] text-amber-400 italic">
                        * Exceeds calculated monthly savings (₹{formatCurrency(actualSavingsBucket)}).
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-teal-300">Target (Years)</Label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold w-8">{years}</span>
                        <Slider value={[years]} min={1} max={30} step={1} onValueChange={(val) => setYears(val[0])} />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-teal-300">Annual Return (%)</Label>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold w-10">{expectedReturn}%</span>
                        <Slider value={[expectedReturn]} min={1} max={25} step={0.5} onValueChange={(val) => setExpectedReturn(val[0])} />
                      </div>
                    </div>
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