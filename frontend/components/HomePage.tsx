"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PublicNav } from "./public-nav";
import { PublicFooter } from "./public-footer";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileText,
  Clock,
  Shield,
  ArrowRight,
  Users,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";

export default function PublicHome() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      if (user.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }
    }
  }, [user, router]);

  const features = [
    {
      icon: FileText,
      title: "Digital Vehicle Registration",
      description:
        "Submit complete vehicle and owner information online without visiting any office.",
    },
    {
      icon: Clock,
      title: "Application Status Tracking",
      description:
        "Follow your registration status (Pending, Approved, Rejected) in real-time from your dashboard.",
    },
    {
      icon: LayoutDashboard,
      title: "Citizen & Admin Dashboards",
      description:
        "Citizens manage their own registrations, while admins review and approve submissions.",
    },
    {
      icon: Shield,
      title: "Secure Government-Grade System",
      description:
        "All data is stored securely and handled through authenticated user accounts.",
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Create Your Account",
      description:
        "Sign up with your email and basic details to access the system.",
    },
    {
      number: "2",
      title: "Enter Vehicle & Owner Info",
      description:
        "Provide vehicle details (plate, chassis, engine, type) and owner information.",
    },
    {
      number: "3",
      title: "Submit Registration Request",
      description:
        "Send your registration for official review by the responsible authority.",
    },
    {
      number: "4",
      title: "Track Review & Approval",
      description:
        "Monitor your application status and view the final decision from your dashboard.",
    },
  ];

  return (
    <>
      <PublicNav />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                  Vehicle Registration System for Citizens & Government
                </h1>
                <p className="text-lg lg:text-xl mb-8 text-white/90">
                  Register your vehicle online, submit owner details, and let
                  government officials review and approve your application. All
                  from a single, secure web dashboard.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/register">
                    <Button className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-6">
                      Get Started
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button
                      variant="outline"
                      className="border-white text-white hover:bg-white/10 text-lg px-8 py-6 bg-transparent"
                    >
                      Go to Login
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="bg-white/10 rounded-lg p-8 backdrop-blur-sm border border-white/20">
                  <svg
                    className="w-full h-auto"
                    viewBox="0 0 400 300"
                    fill="none"
                  >
                    <rect
                      x="50"
                      y="40"
                      width="300"
                      height="200"
                      rx="8"
                      fill="white"
                      opacity="0.1"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <rect
                      x="70"
                      y="70"
                      width="260"
                      height="30"
                      rx="4"
                      fill="white"
                      opacity="0.2"
                    />
                    <rect
                      x="70"
                      y="120"
                      width="260"
                      height="20"
                      rx="4"
                      fill="white"
                      opacity="0.15"
                    />
                    <rect
                      x="70"
                      y="160"
                      width="180"
                      height="20"
                      rx="4"
                      fill="white"
                      opacity="0.15"
                    />
                    <circle
                      cx="320"
                      cy="260"
                      r="30"
                      fill="white"
                      opacity="0.2"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 lg:py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Why Use This Vehicle Registration System?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                The system digitalizes the full registration process, reduces
                manual paperwork, and gives both citizens and government clear
                visibility on each application.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card
                    key={index}
                    className="border border-border hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-6">
                      <Icon className="w-12 h-12 text-primary mb-4" />
                      <h3 className="font-semibold text-lg mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 lg:py-32 bg-secondary/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                How the Registration Process Works
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                The workflow is simple: create an account, provide your vehicle
                and owner details, submit, and follow your application status
                until approval.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-border">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white font-bold text-lg mb-4">
                      {step.number}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {step.description}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-12 -right-3 w-6 h-1 bg-gradient-to-r from-primary to-accent" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-32 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center mb-6">
              <Users className="w-16 h-16 text-primary" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Register Your Vehicle?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Create your account, submit a new registration request, and let
              the system handle the workflow between you and the government
              officials.
            </p>
            <Link href="/register">
              <Button className="bg-primary hover:bg-primary/90 text-white text-lg px-10 py-6">
                Start Vehicle Registration
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
