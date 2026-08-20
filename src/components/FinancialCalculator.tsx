import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { 
  ShieldCheck, 
  Target, 
  Wallet,
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
import { useLanguage } from "@/context/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

const COLORS = ['#14B8A6', '#2DD4BF', '#F59E0B', '#10B981', '#E2E8F0'];

type GrowthView = "combined" | "sip" | "fd";

export default function FinancialCalculator() {
  const { t } = useLanguage();

  // --- State ---
  const [income, setIncome] = useState<number>(2000);
  const [expenses, setExpenses] = useState<number>(1000); // 50% of 2000
  const [needsExpense, setNeedsExpense] = useState<number>(600); // New state: 30% of 2000
  const [healthPremium, setHealthPremium] = useState<number>(650);
  const [termPremium, setTermPremium] = useState<number>(500);
  const [monthlySIP, setMonthlySIP] = useState<number>(0);
  const [fdAmount, setFdAmount] = useState<number>(0);
  
  const [savings, setSavings] = useState<number>(10000);
  const [years, setYears] = useState<number>(10);
  const [expectedReturn, setExpectedReturn] = useState<number>(12);
  const [fdReturn, setFdReturn] = useState<number>(6);
  const [growthView, setGrowthView] = useState<GrowthView>("combined");

  // --- Calculations ---
  const totalNeeds = expenses + needsExpense + healthPremium + termPremium;
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
  
  const safetyNetTarget = totalNeeds * 6;
  const safetyNetProgress = Math.min((savings / safetyNetTarget) * 100, 100);

  // Data for the line graph showing wealth growth over years (SIP + FD growth) - split for modes
  const wealthGrowthData = useMemo(() => {
    const data = [];
    const rSIP = expectedReturn / 100 / 12;
    const rFD = fdReturn / 100 / 12;
    
    for (let i = 0; i <= years; i++) {
      const n = i * 12;
      let sipWealth = 0;
      let fdWealth = 0;
      
      if (rSIP === 0) sipWealth = monthlySIP * n;
      else sipWealth = monthlySIP * ((Math.pow(1 + rSIP, n) - 1) / rSIP) * (1 + rSIP);
      
      if (rFD === 0) fdWealth = fdAmount * n;
      else fdWealth = fdAmount * ((Math.pow(1 + rFD, n) - 1) / rFD) * (1 + rFD);

      data.push({
        year: `${t("yearLabel")} ${i}`,
        sip: Math.round(sipWealth),
        fd: Math.round(fdWealth),
        wealth: Math.round(sipWealth + fdWealth),
        combined: Math.round(sipWealth + fdWealth),
      });
    }
    return data;
  }, [monthlySIP, fdAmount, years, expectedReturn, fdReturn, t]);

  const last = wealthGrowthData[wealthGrowthData.length - 1];
  const totalCombined = last.combined;
  const totalSip = last.sip;
  const totalFd = last.fd;

  const displayWealth = growthView === "sip" ? totalSip : growthView === "fd" ? totalFd : totalCombined;

  const growthTitle = growthView === "sip" ? t("growthSip") : growthView === "fd" ? t("growthFd") : t("growthCombined");

  const pieData = [
    { name: t("needs"), value: expenses + needsExpense + healthPremium + termPremium },
    { name: t("sip"), value: monthlySIP },
    { name: t("fd"), value: fdAmount },
    { name: t("balance"), value: finalBalance },
  ];

  const formatCurrency = (val: number) => {
    return val.toLocaleString('en-IN', {
      maximumFractionDigits: 0,
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <header className="text-center space-y-4 relative">
        <div className="flex justify-end sm:absolute sm:top-0 sm:right-0 mb-2 sm:mb-0">
          <LanguageToggle />
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-sm font-medium border border-teal-100 mb-2">
          <ShieldCheck className="h-4 w-4" /> {t("secureFuture")}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-teal-950">
          {t("title")}
        </h1>
        <p className="text-lg text-teal-700/80 max-w-2xl mx-auto leading-relaxed">
          {t("subtitle")}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-teal-100/50 shadow-xl shadow-teal-900/5 overflow-hidden">
            <div className="h-2 bg-teal-500" />
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-teal-900">
                <Wallet className="h-5 w-5 text-teal-600" /> {t("financialInputs")}
              </CardTitle>
              <CardDescription>{t("adjustFlows")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Income */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-teal-900 font-medium">{t("monthlyNetSalary")}</Label>
                  <span className="text-xs font-bold text-teal-600">₹{formatCurrency(income)}</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-teal-400 font-medium z-10">₹</span>
                  <Input
                    type="number"
                    className="pl-8 border-teal-100 bg-teal-50/30 h-10 mb-2"
                    value={income}
                    onChange={(e) => {
                      const newIncome = Number(e.target.value);
                      setIncome(newIncome);
                      setExpenses(Math.floor(newIncome * 0.5));
                      setNeedsExpense(Math.floor(newIncome * 0.3));
                    }}
                  />
                  <Slider 
                    value={[income]} 
                    max={100000} 
                    step={100} 
                    onValueChange={(val) => {
                      setIncome(val[0]);
                      setExpenses(Math.floor(val[0] * 0.5));
                      setNeedsExpense(Math.floor(val[0] * 0.3));
                    }} 
                  />
                </div>
              </div>

              {/* Essential Expenses (50% default) */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-teal-900 font-medium">{t("essentialExpenses")}</Label>
                  <span className="text-xs font-bold text-teal-600">₹{formatCurrency(expenses)}</span>
                </div>
                <Slider value={[expenses]} max={income} step={100} onValueChange={(val) => setExpenses(val[0])} />
              </div>

              {/* Needs Expense (30% default) */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-teal-900 font-medium">{t("needsExpense")}</Label>
                  <span className="text-xs font-bold text-teal-600">₹{formatCurrency(needsExpense)}</span>
                </div>
                <Slider value={[needsExpense]} max={income} step={100} onValueChange={(val) => setNeedsExpense(val[0])} />
              </div>

              {/* Insurance */}
              <div className="space-y-6 pt-2">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs font-medium text-teal-700">{t("healthPremium")}</Label>
                    <span className="text-xs font-bold text-teal-600">₹{formatCurrency(healthPremium)}</span>
                  </div>
                  <Slider 
                    value={[healthPremium]} 
                    min={500} 
                    max={2000} 
                    step={10} 
                    onValueChange={(val) => setHealthPremium(val[0])} 
                  />
                  <p className="text-[10px] text-teal-500 italic">{t("rangeHealth")}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs font-medium text-teal-700">{t("termPremium")}</Label>
                    <span className="text-xs font-bold text-teal-600">₹{formatCurrency(termPremium)}</span>
                  </div>
                  <Slider 
                    value={[termPremium]} 
                    min={500} 
                    max={2500} 
                    step={10} 
                    onValueChange={(val) => setTermPremium(val[0])} 
                  />
                  <p className="text-[10px] text-teal-500 italic">{t("rangeTerm")}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-teal-50 space-y-6">
                <div className="flex justify-between items-center mb-2">
                  <Label className="text-teal-900 font-bold text-sm">{t("investmentsSavings")}</Label>
                  <div className="text-right">
                    <p className="text-[10px] text-teal-500 uppercase">{t("availablePool")}</p>
                    <p className="text-sm font-bold text-teal-700">₹{formatCurrency(availablePool)}</p>
                  </div>
                </div>

                {/* SIP Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs font-medium flex items-center gap-1.5">
                      <Target className="h-3.5 w-3.5 text-teal-600" /> {t("monthlySIP")}
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
                      <Coins className="h-3.5 w-3.5 text-amber-500" /> {t("monthlyFD")}
                    </Label>
                    <span className="text-xs font-bold text-amber-600">₹{formatCurrency(fdAmount)}</span>
                  </div>
                  <Slider 
                    value={[fdAmount]} 
                    max={Math.max(0, availablePool - monthlySIP)} 
                    step={10} 
                    onValueChange={(val) => setFdAmount(val[0])} 
                    className="[&_[role=slider]]:bg-amber-500"
                  />
                </div>
              </div>

              {/* Balance Display */}
              <div className="p-4 rounded-xl bg-teal-950 text-white flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-teal-400 font-medium uppercase">{t("finalBalance")}</p>
                  <p className="text-xl font-bold">₹{formatCurrency(finalBalance)}</p>
                </div>
                <Banknote className="h-6 w-6 text-teal-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-teal-100/50 shadow-lg shadow-teal-900/5 bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase text-teal-600">{t("safetyNetCoverage")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end mb-2">
                <span className="text-xl font-bold text-teal-900">₹{formatCurrency(savings)}</span>
                <span className="text-xs text-teal-500">{t("goal")}: ₹{formatCurrency(safetyNetTarget)}</span>
              </div>
              <Progress value={safetyNetProgress} className="h-2 bg-teal-50" indicatorClassName="bg-teal-500" />
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Section */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="border-teal-100/50 shadow-xl shadow-teal-900/5 bg-white overflow-hidden">
            <CardHeader>
              <CardTitle className="text-2xl text-teal-950">{t("incomeAllocation")}</CardTitle>
              <CardDescription>{t("breakdown")} ₹{formatCurrency(income)}</CardDescription>
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
                      <Target className="h-4 w-4 text-teal-600" /> {t("wealthProjection")}
                    </h4>
                    <div className="space-y-4">
                      <div className="flex justify-between text-xs">
                        <span className="text-teal-600">{t("targetYears")}</span>
                        <div className="flex items-center gap-4 w-1/2">
                          <Slider value={[years]} min={1} max={30} step={1} onValueChange={(val) => setYears(val[0])} />
                          <span className="font-bold text-teal-900 w-8">{years}{t("yearSuffix")}</span>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-teal-600">{t("sipReturn")}</span>
                        <div className="flex items-center gap-4 w-1/2">
                          <Slider value={[expectedReturn]} min={1} max={25} step={0.5} onValueChange={(val) => setExpectedReturn(val[0])} />
                          <span className="font-bold text-teal-900 w-8">{expectedReturn}%</span>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-teal-600">{t("fdReturn")}</span>
                        <div className="flex items-center gap-4 w-1/2">
                          <Slider value={[fdReturn]} min={4} max={8.5} step={0.1} onValueChange={(val) => setFdReturn(val[0])} />
                          <span className="font-bold text-teal-900 w-10">{fdReturn.toFixed(1)}%</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-teal-500 italic -mt-2">{t("fdInterestRange")}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Growth Chart with view toggle */}
              <div className="space-y-4 pt-6 border-t border-teal-50">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold text-teal-900 flex items-center gap-2">
                      <LineChartIcon className="h-5 w-5 text-teal-600" /> {growthTitle}
                    </h3>
                    {/* View toggle: Combined / SIP Alone / FD Alone */}
                    <div className="inline-flex p-1 rounded-full bg-teal-50 border border-teal-100 self-start sm:self-auto">
                      <button
                        onClick={() => setGrowthView("combined")}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${growthView === "combined" ? "bg-teal-600 text-white shadow" : "text-teal-700 hover:bg-white"}`}
                      >
                        {t("viewCombined")}
                      </button>
                      <button
                        onClick={() => setGrowthView("sip")}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${growthView === "sip" ? "bg-teal-600 text-white shadow" : "text-teal-700 hover:bg-white"}`}
                      >
                        {t("viewSipOnly")}
                      </button>
                      <button
                        onClick={() => setGrowthView("fd")}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${growthView === "fd" ? "bg-amber-500 text-white shadow" : "text-teal-700 hover:bg-white"}`}
                      >
                        {t("viewFdOnly")}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-teal-600">{t("wealthAfter")} {years} {t("years")}</p>
                    <div className="text-right">
                      <p className={`text-xl font-bold ${growthView === "fd" ? "text-amber-600" : growthView === "sip" ? "text-teal-600" : "text-emerald-600"}`}>₹{formatCurrency(displayWealth)}</p>
                      {growthView === "combined" && totalSip > 0 && totalFd > 0 && (
                        <p className="text-[11px] text-teal-500">
                          {t("sip")}: ₹{formatCurrency(totalSip)} · {t("fd")}: ₹{formatCurrency(totalFd)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={wealthGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0fdfa" />
                      <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#0d9488', fontSize: 11 }} />
                      <YAxis hide />
                      <RechartsTooltip 
                        formatter={(value: number, name: string) => {
                          const label = name === "sip" ? t("sipWealth") : name === "fd" ? t("fdWealth") : name === "wealth" || name === "combined" ? t("combinedWealth") : t("wealth");
                          return [`₹${formatCurrency(value as number)}`, label];
                        }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                      {growthView === "combined" && (
                        <Line type="monotone" dataKey="wealth" name="combined" stroke="#0d9488" strokeWidth={3} dot={false} />
                      )}
                      {growthView === "sip" && (
                        <Line type="monotone" dataKey="sip" name="sip" stroke="#14B8A6" strokeWidth={3} dot={false} />
                      )}
                      {growthView === "fd" && (
                        <Line type="monotone" dataKey="fd" name="fd" stroke="#F59E0B" strokeWidth={3} dot={false} />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                {/* Small legend hint */}
                <div className="flex items-center justify-center gap-4 text-[11px] text-teal-600">
                  {growthView === "combined" ? (
                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-teal-600 inline-block" /> {t("combinedWealth")} (SIP + FD @ {fdReturn.toFixed(1)}%)</span>
                  ) : growthView === "sip" ? (
                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-teal-500 inline-block" /> {t("sipWealth")} @ {expectedReturn}%</span>
                  ) : (
                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500 inline-block" /> {t("fdWealth")} @ {fdReturn.toFixed(1)}%</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
