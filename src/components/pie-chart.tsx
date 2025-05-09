"use client";

import { TrendingUp } from "lucide-react";
import { LabelList, Pie, PieChart } from "recharts";

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

const chartConfig = {
  acousticness: {
    label: "Acousticness",
    color: "#333333",
  },
  danceability: {
    label: "Danceability",
    color: "#4A4A4A",
  },
  energy: {
    label: "Energy",
    color: "#A0A0A0",
  },
  instrumentalness: {
    label: "Instrumentalness",
    color: "#808080",
  },
  loudness: {
    label: "Loudness",
    color: "#000000",
  },
  speechiness: {
    label: "Speechiness",
    color: "#505050",
  },
  tempo: {
    label: "Tempo",
    color: "#303030",
  },
  valence: {
    label: "Valence",
    color: "#1A1A1A",
  },
} satisfies ChartConfig;

const generateChartData = (preferences: any) => {
  return Object.keys(preferences).map((key) => ({
    preference: key,
    value: preferences[key] * 100,
    fill: chartConfig[key]?.color || "gray",
  }));
};

export function PreferencePieChart({ preferences }: any) {
  const chartData = generateChartData(preferences);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Your Flow's Preferences</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] [&_.recharts-text]:fill-background"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="preference" hideLabel />}
            />
            <Pie data={chartData} dataKey="value">
              <LabelList
                dataKey="preference"
                className="fill-background"
                stroke="none"
                fontSize={10}
                formatter={(value: keyof typeof chartConfig) =>
                  chartConfig[value]?.label
                }
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex flex-col gap-2 leading-none">
          <div>The preferences ranked by their percentage contribution:</div>
          {Object.keys(preferences)
            .sort((a, b) => preferences[b] - preferences[a])
            .map((key) => (
              <div key={key}>
                {chartConfig[key]?.label}: {Math.round(preferences[key] * 100)}%
              </div>
            ))}
        </div>
      </CardFooter>
    </Card>
  );
}
