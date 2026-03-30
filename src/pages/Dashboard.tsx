import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Target,
  TrendingUp,
  Zap,
  ChevronRight,
  Play,
  Award,
  Clock,
  Menu,
  LayoutDashboard,
  Brain,
  Calendar,
  Map,
  Lightbulb,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { useApp } from "@/contexts/AppContext";
import Sidebar from "@/components/Sidebar";
import Countdown from "@/components/Countdown";
import Recommendations from "@/components/Recommendations";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { MOCK_PROGRESS_DATA } from "@/data/mockData";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, studyPlan, predictedScore, streak, completeTask, logout } =
    useApp();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useIsMobile();

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/ai-tutor", label: "AI Tutor", icon: Brain },
    { path: "/study-plan", label: "Study Plan", icon: Calendar },
    { path: "/practice", label: "Practice", icon: BookOpen },
    { path: "/cbt-simulator", label: "CBT Simulator", icon: Target },
    { path: "/progress", label: "Progress", icon: TrendingUp },
    { path: "/weakness-map", label: "Weakness Map", icon: Map },
    { path: "/recommendations", label: "Recommendations", icon: Lightbulb },
  ];

  const pendingTasks = studyPlan?.tasks.filter((t) => !t.completed) || [];
  const completedTasks = studyPlan?.tasks.filter((t) => t.completed) || [];
  const progressPercentage = studyPlan?.tasks.length
    ? Math.round((completedTasks.length / studyPlan.tasks.length) * 100)
    : 0;

  const stats = [
    {
      label: "Study Streak",
      value: `${streak} days`,
      icon: Zap,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      label: "Predicted Score",
      value: predictedScore,
      icon: Target,
      color: "text-kwado-green",
      bgColor: "bg-kwado-green/10",
    },
    {
      label: "Tasks Done",
      value: `${completedTasks.length}/${studyPlan?.tasks.length || 0}`,
      icon: Award,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
  ];

  return (
    <div className={`min-h-screen bg-kwado-bg ${isMobile ? "" : "flex"}`}>
      {!isMobile && (
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      )}

      <main
        className={`flex-1 ${isMobile ? "" : `transition-all duration-300 ${sidebarCollapsed ? "ml-[72px]" : "ml-[260px]"}`}`}
      >
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-kwado-bg/80 backdrop-blur-md border-b border-kwado-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-xl font-display font-bold text-kwado-text">
                Welcome back, {user?.name.split(" ")[0]}
              </h1>
              <p className="text-sm text-kwado-text-muted">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {isMobile && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="w-9 h-9">
                      <Menu className="w-5 h-5" />
                      <span className="sr-only">Toggle navigation</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    {navItems.map((item) => (
                      <DropdownMenuItem
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <item.icon className="w-4 h-4" />
                        {item.label}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => navigate("/settings")}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={logout}
                      className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              {/* Streak Badge */}
              <div className="streak-badge">
                <Zap className="w-4 h-4" />
                <span>{streak} day streak</span>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats Row */}
              <div className="grid sm:grid-cols-3 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="kwado-card p-5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center`}
                      >
                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                      <div>
                        <p className="text-2xl font-display font-bold text-kwado-text">
                          {stat.value}
                        </p>
                        <p className="text-sm text-kwado-text-muted">
                          {stat.label}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Today's Study Plan */}
              <div className="kwado-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-display font-bold text-kwado-text">
                      Today's Study Plan
                    </h2>
                    <p className="text-sm text-kwado-text-muted">
                      {progressPercentage}% completed
                    </p>
                  </div>
                  <Button
                    onClick={() => navigate("/study-plan")}
                    variant="ghost"
                    className="text-kwado-green hover:text-kwado-green hover:bg-kwado-green/10"
                  >
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>

                {/* Progress Bar */}
                <div className="kwado-progress mb-6">
                  <div
                    className="kwado-progress-bar"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>

                {pendingTasks.length > 0 ? (
                  <div className="space-y-3">
                    {pendingTasks.slice(0, 3).map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-4 rounded-xl border border-kwado-border hover:border-kwado-green/50 transition-all duration-200"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              task.type === "practice"
                                ? "bg-kwado-green/10"
                                : task.type === "learn"
                                  ? "bg-blue-500/10"
                                  : "bg-purple-500/10"
                            }`}
                          >
                            <BookOpen
                              className={`w-5 h-5 ${
                                task.type === "practice"
                                  ? "text-kwado-green"
                                  : task.type === "learn"
                                    ? "text-blue-500"
                                    : "text-purple-500"
                              }`}
                            />
                          </div>
                          <div>
                            <p className="font-medium text-kwado-text">
                              {task.title}
                            </p>
                            <p className="text-sm text-kwado-text-muted">
                              {task.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-sm text-kwado-text-muted">
                            <Clock className="w-4 h-4" />
                            {task.estimatedTime}m
                          </div>
                          <Button
                            size="sm"
                            onClick={() => completeTask(task.id)}
                            className="kwado-btn-primary py-2 px-4"
                          >
                            <Play className="w-4 h-4 mr-1" />
                            Start
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-kwado-green/10 flex items-center justify-center mx-auto mb-4">
                      <Award className="w-8 h-8 text-kwado-green" />
                    </div>
                    <p className="text-kwado-text font-medium">
                      All tasks completed!
                    </p>
                    <p className="text-sm text-kwado-text-muted">
                      Great job today!
                    </p>
                  </div>
                )}
              </div>

              {/* Progress Chart */}
              <div className="kwado-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-display font-bold text-kwado-text">
                    Progress Overview
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-kwado-text-muted">
                    <TrendingUp className="w-4 h-4 text-kwado-green" />
                    <span>+15% this week</span>
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={MOCK_PROGRESS_DATA}>
                      <XAxis
                        dataKey="date"
                        tickFormatter={(date) =>
                          new Date(date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        }
                        stroke="#5A7368"
                        fontSize={12}
                      />
                      <YAxis stroke="#5A7368" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#111917",
                          border: "1px solid #1F2A26",
                          borderRadius: "12px",
                        }}
                        labelStyle={{ color: "#EAFBF3" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="accuracy"
                        stroke="#22C55E"
                        strokeWidth={3}
                        dot={{ fill: "#22C55E", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: "#22C55E", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Countdown */}
              <Countdown />

              {/* Quick Actions */}
              <div className="kwado-card p-6">
                <h2 className="text-lg font-display font-bold text-kwado-text mb-4">
                  Quick Actions
                </h2>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate("/practice")}
                    className="w-full flex items-center gap-3 p-4 rounded-xl border border-kwado-border hover:border-kwado-green/50 hover:bg-kwado-green/5 transition-all duration-200 text-left"
                  >
                    <div className="w-10 h-10 rounded-xl bg-kwado-green/10 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-kwado-green" />
                    </div>
                    <div>
                      <p className="font-medium text-kwado-text">Practice</p>
                      <p className="text-sm text-kwado-text-muted">
                        Quick practice session
                      </p>
                    </div>
                  </button>
                  <button
                    onClick={() => navigate("/cbt-simulator")}
                    className="w-full flex items-center gap-3 p-4 rounded-xl border border-kwado-border hover:border-kwado-green/50 hover:bg-kwado-green/5 transition-all duration-200 text-left"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                      <Target className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium text-kwado-text">
                        CBT Simulator
                      </p>
                      <p className="text-sm text-kwado-text-muted">
                        Full exam simulation
                      </p>
                    </div>
                  </button>
                  <button
                    onClick={() => navigate("/ai-tutor")}
                    className="w-full flex items-center gap-3 p-4 rounded-xl border border-kwado-border hover:border-kwado-green/50 hover:bg-kwado-green/5 transition-all duration-200 text-left"
                  >
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="font-medium text-kwado-text">AI Tutor</p>
                      <p className="text-sm text-kwado-text-muted">
                        Get help with topics
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Recommendations */}
              <Recommendations />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
