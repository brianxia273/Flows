"use client";
import "./styles.css";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { PreferenceChart } from "@/components/preference-chart";
import { FlowCreate } from "./flow-create";
import { useAuth } from "@/components/auth-provider";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/clientApp";

export function Dashboard() {
  const { user, loading, error } = useAuth();
  const [flows, setFlows] = useState<any[]>([]);

  const flowCount: number = 0;
  const hasNoFlows: boolean = flowCount === 0;
  const [isBHovered, setIsBHovered] = useState(false);

  useEffect(() => {
    const fetchFlows = async () => {
      if (user && !loading) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setFlows(userData.flows || []);
        }
      }
    };
  });

  return (
    <div className="w-full h-screen flex items-center justify-center">
      {hasNoFlows ? (
        <div className="bg-[#1e2424] h-[95%] w-[100%] dashboard-text flex flex-col justify-center items-center gap-5 rounded-2xl">
          <h1 className="w-full text-center text-4xl">
            <CardTitle>Welcome to Flows!</CardTitle>
          </h1>
          <h2 className="mb-7">Let’s get you started with your first Flow.</h2>
          <FlowCreate></FlowCreate>
        </div>
      ) : (
        <div className="relative bg-[#1e2424] h-[95%] w-[100%] dashboard-text flex flex-col items-center gap-5 rounded-2xl dashboard-text">
          <header
            className="absolute top-0 left-0 w-full h-[25%] rounded-t-2xl"
            style={{
              backgroundImage: `linear-gradient(45deg, #3c87fd, #a16be3)`,
              position: "relative",
            }}
          >
            <div className="absolute bottom-2 left-10 text-white font-semibold flow-header-text drop-shadow-[0_0_20px_#ffffff]">
              Study Flow
            </div>
          </header>
          <div className="flex">
            <PreferenceChart />
            <div className="flex flex-col"></div>
          </div>
        </div>
      )}
    </div>
  );
}
