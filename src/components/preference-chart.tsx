"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { feature: "Energy", score: 186 },
  { feature: "Tempo", score: 305 },
  { feature: "Danceability", score: 237 },
  { feature: "Acousticness", score: 273 },
  { feature: "Valence", score: 209 },
  { feature: "Instrumentalness", score: 214 },
];

const chartConfig = {
  score: {
    label: "Score",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function PreferenceChart() {
  return (
    <Card className="w-[400px] mx-auto bg-[#1e2424]">
      <CardHeader className="flex items-center justify-center pb-4 home-text">
        <CardTitle>Flow Preferences</CardTitle>
      </CardHeader>
      <CardContent className="pb-0 font">
        <ChartContainer
          config={chartConfig}
          className="mx-auto w-full max-w-[350px] max-h-[350px]" // Set max width and height
        >
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="feature" tick={{ fill: "#ebf6f9" }} />
            <PolarGrid stroke="#ebf6f9" />
            <Radar dataKey="score" fill="#5d66e7" fillOpacity={0.5} />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
