"use client";
import {
  Calendar,
  House,
  Inbox,
  Search,
  Settings,
  ListMusic,
  AudioLines,
  UserRound,
} from "lucide-react";
import { BsSoundwave } from "react-icons/bs";
import "./styles.css";
import { useEffect, useState } from "react";
import { useAuth } from "./auth-provider";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/clientApp";

const items = [
  {
    title: "Home",
    url: "#",
    icon: House,
  },
  {
    title: "Your Flows",
    url: "#",
    icon: ListMusic,
  },
  {
    title: "Edit Flows",
    url: "#",
    icon: AudioLines,
  },
  {
    title: "Browse",
    url: "#",
    icon: Search,
  },
  {
    title: "Account",
    url: "#",
    icon: UserRound,
  },
];

export function AppSidebar() {
  const [flows, setFlows] = useState<any[]>([]);
  const flowCount: number = flows.length;
  const { user, loading, error } = useAuth();

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
    <div className="flex flex-col w-[20%] h-[95%] bg-[#1e2424] shadow-none rounded-2xl">
      <div className="mt-6 px-6">
        <div
          className="home-text logo-text pr-10"
          style={{ color: "#ebf6f9", fontSize: "2.2rem" }}
        >
          Fl
          <BsSoundwave
            style={{
              fontSize: "2.2rem",
              color: "#ebf6f9",
              verticalAlign: "middle",
              display: "inline-block",
            }}
          />
          ws
        </div>
      </div>

      <div className="mt-8 px-6 flex flex-col gap-5 menu-text">
        <div className="dashboard-text pl-2">MENU</div>
        {items.map((item) => (
          <div key={item.title} className="w-full">
            <a
              href={item.url}
              className="dashboard-text flex items-center justify-between w-full py-2 hover:bg-[#2a2f2f] rounded-lg px-2 transition"
            >
              <div className="flex items-center gap-2">
                <item.icon />
                <span>{item.title}</span>
              </div>
              {item.title === "Your Flows" && (
                <span className="pr-6 dashboard-text px-2 py-0.5">
                  {flowCount}
                </span>
              )}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
