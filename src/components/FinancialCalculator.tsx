import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, AlertCircle, ShieldCheck, Heart, PiggyBank, Target, Wallet } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#26A69A', '#4DB6AC', '#80CBC4', '#B2DFDB'];

export default function FinancialCalculator() {
  // --- State ---
  const [income, setIncome] = useState<number>(5000);
  const [expenses, setExpenses] = useState<number>(2000);
  const [savings, setSavings] = useState<number>(10000);
  const [healthPremium, setHealthPremium] = useState<number>(200);
  
  // SIP Goals
  const [goalAmount, setGoalAmount] = useState<number>(50000);
  const [years, setYears] = useState<number>(5);
  const [expectedReturn, setExpectedReturn] = useState<number>(12);

  // --- Calculations ---
  const needsLimit = income * 0.5;
  const wantsLimit = income * 0.3;
  const savingsLimit = income * 0.2;

  const totalNeeds = expenses + healthPremium;
  const needsPercentage = (totalNeeds / income) * 100;

  const termLifeCover = income * 12 * 20; // 20x Annual Income

  // Safety Net Logic
  const safetyNetTarget = totalNeeds * 6;
  const safetyNetProgress = Math.min((savings / safetyNetTarget) * 100, 100);

  // SIP Calculation: P = (FV * r) / ((1 + r)^n - 1)

  const requiredSIP = useMemo(() => {
    const r = expectedReturn / 100 / 12;
    const n = years * 12;
    if (r === 0) return goalAmount / n;
    return (goalAmount * r) / (Math.pow(1 + r, n) - 1);
  }, [goalAmount, years, expectedReturn]);

  const pieData = [
    { name: 'Needs', value: Math.min(totalNeeds, income) },
    { name: 'Wants', value: Math.max(0, income - totalNeeds - savingsLimit) },
    { name: 'Savings/SIP', value: savingsLimit },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-700">
      <header className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-teal-900 sm:text-5xl">
          Financial Security Calculator
        </h1>
        <p className="text-xl text-teal-700 max-w-2xl mx-auto font-medium">
          A supportive tool to help you navigate your financial transition with clarity and peace of mind.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <Card className="lg:col-span-1 border-teal-100 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-teal-800">
              <Wallet className="h-5 w-5" /> Your Monthly Details
            </CardTitle>
            <CardDescription>Enter your current financial situation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="income">Monthly Net Salary (After Tax)</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-teal-500">$</span>
                <Input
                  id="income"
                  type="number"
                  className="pl-7 border-teal-200 focus:ring-teal-500"
                  value={income}
                  onChange={(e) => setIncome(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expenses">Monthly Essential Expenses</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-teal-500">$</span>
                <Input
                  id="expenses"
                  type="number"
                  className="pl-7 border-teal-200 focus:ring-teal-500"
                  value={expenses}
                  onChange={(e) => setExpenses(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="savings">Existing Safety Net (Total Savings)</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-teal-500">$</span>
                <Input
                  id="savings"
                  type="number"
                  className="pl-7 border-teal-200 focus:ring-teal-500"
                  value={savings}
                  onChange={(e) => setSavings(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="health">Health Insurance Premium</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-teal-500">$</span>
                <Input
                  id="health"
                  type="number"
                  className="pl-7 border-teal-200 focus:ring-teal-500"
                  value={healthPremium}
                  onChange={(e) => setHealthPremium(Number(e.target.value))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Section */}
        <div className="lg:col-span-2 space-y-8">
          {/* 50/30/20 Dashboard */}
          <Card className="border-teal-100 shadow-md bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-teal-900">The 50/30/20 Breakdown</CardTitle>
              <CardDescription>Visualizing your monthly budget allocation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span>Needs (Target 50%)</span>
                      <span className={needsPercentage > 50 ? "text-rose-500 font-bold" : "text-teal-700"}>
                        ${totalNeeds.toLocaleString()} ({needsPercentage.toFixed(1)}%)
                      </span>
                    </div>
                    <Progress value={needsPercentage} className="h-2 bg-teal-50" indicatorClassName={needsPercentage > 50 ? "bg-rose-400" : "bg-teal-500"} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium text-teal-700">
                      <span>Wants (Target 30%)</span>
                      <span>${wantsLimit.toLocaleString()} (30%)</span>
                    </div>
                    <Progress value={30} className="h-2 bg-teal-50" indicatorClassName="bg-teal-400" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium text-teal-700">
                      <span>Savings (Target 20%)</span>
                      <span>${savingsLimit.toLocaleString()} (20%)</span>
                    </div>
                    <Progress value={20} className="h-2 bg-teal-50" indicatorClassName="bg-teal-300" />
                  </div>
                </div>
              </div>

              {needsPercentage > 50 && (
                <Alert variant="destructive" className="mt-6 bg-rose-50 border-rose-200 text-rose-900">
                  <AlertCircle className="h-4 w-4 text-rose-600" />
                  <AlertTitle>Gentle Suggestion</AlertTitle>
                  <AlertDescription>
                    Your "Needs" (including insurance) currently exceed 50% of your income. 
                    Consider reviewing your essential expenses or rebalancing to ensure long-term financial comfort.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Insurance Engine */}
            <Card className="border-teal-100 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-teal-800">
                  <ShieldCheck className="h-5 w-5" /> Insurance Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-teal-50 border border-teal-100">
                  <h4 className="font-semibold text-teal-900 flex items-center gap-2">
                    <Heart className="h-4 w-4 text-rose-400" /> Recommended Term Cover
                  </h4>
                  <p className="text-2xl font-bold text-teal-700 mt-1">
                    ${termLifeCover.toLocaleString()}
                  </p>
                  <p className="text-xs text-teal-600 mt-1 italic">
                    Based on 20x your annual income for complete peace of mind.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-teal-50 border border-teal-100">
                  <h4 className="font-semibold text-teal-900">Health Coverage</h4>
                  <p className="text-lg text-teal-700 mt-1">
                    Current Premium: ${healthPremium.toLocaleString()}/mo
                  </p>
                  <p className="text-xs text-teal-600 mt-1">
                    Ensure this covers both major hospitalizations and outpatient needs.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* SIP/Goal Calculator */}
            <Card className="border-teal-100 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-teal-800">
                  <Target className="h-5 w-5" /> Future Aspirations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs">Financial Goal ($)</Label>
                    <Input 
                      type="number" 
                      size={1}
                      value={goalAmount} 
                      onChange={(e) => setGoalAmount(Number(e.target.value))}
                      className="border-teal-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Time (Years)</Label>
                    <Input 
                      type="number" 
                      value={years} 
                      onChange={(e) => setYears(Number(e.target.value))}
                      className="border-teal-200"
                    />
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-teal-900 text-teal-50">
                  <h4 className="font-medium text-teal-200 flex items-center gap-2">
                    <PiggyBank className="h-4 w-4" /> Required Monthly SIP
                  </h4>
                  <p className="text-2xl font-bold mt-1">
                    ${requiredSIP.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    {requiredSIP <= savingsLimit ? (
                      <span className="text-xs bg-teal-700 px-2 py-1 rounded text-teal-100">
                        Fits in your 20% bucket
                      </span>
                    ) : (
                      <span className="text-xs bg-rose-700 px-2 py-1 rounded text-rose-100">
                        Exceeds 20% savings bucket
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <footer className="text-center pt-8 border-t border-teal-100">
        <p className="text-teal-600 text-sm italic">
          Remember, this is a starting point. Your journey is unique, and small steps lead to big changes.
        </p>
      </footer>
    </div>
  );
}
