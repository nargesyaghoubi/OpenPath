"use client";

import { Opportunity } from "@/types";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

// Chart color palette
const COLORS = ["#6366f1", "#3b82f6", "#6366f1", "#f59e0b", "#06b6d4", "#ef4444", "#ec4899"];

// Dashboard charts component props
interface Props {
    opportunities: Opportunity[];
    t: { chartTitle: string; countryChartTitle: string };
}

const RADIAN = Math.PI / 180;

// Shows just the percentage inside each slice to avoid label overlap
// (full names are in the Legend below). Props are optional because
// Recharts' own type for this is loosely defined

function renderPercentLabel(props: {
    cx?: number; cy?: number; midAngle?: number;
    innerRadius?: number; outerRadius?: number; percent?: number;
}) {
    const { cx = 0, cy = 0, midAngle = 0, innerRadius = 0, outerRadius = 0, percent = 0 } = props;
    // Skip the label entirely for slivers too small to hold readable text
    if (percent < 0.04) return null;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
        <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
}

export default function DashboardCharts({ opportunities, t }: Props) {
    // Aggregate opportunities by category for the pie chart
    const categoryData = [
        "Job", "Internship", "Scholarship", "Online Course", "Remote Work", "Training Program", "Volunteer"
    ].map((cat) => ({
        name: cat,
        value: opportunities.filter((o) => o.category === cat).length,
    })).filter((d) => d.value > 0);
    // Aggregate opportunities by country for the bar chart
    const countryData = Array.from(
        opportunities.reduce((acc, o) => {
            acc.set(o.country, (acc.get(o.country) || 0) + 1);
            return acc;
        }, new Map<string, number>())
    ).map(([name, count]) => ({ name: name === "Global" ? "🌐 Global" : name, count }))
        .sort((a, b) => b.count - a.count);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Opportunity categories pie chart */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6">{t.chartTitle}</h2>
                <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                        <Pie data={categoryData} cx="50%" cy="45%" outerRadius={80} dataKey="value" nameKey="name"
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            label={renderPercentLabel as any}
                            labelLine={false}>
                            {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" align="center" iconType="circle" iconSize={8}
                            wrapperStyle={{ fontSize: 11, paddingTop: 16, lineHeight: "1.8em" }} />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Opportunities by country bar chart */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6">{t.countryChartTitle}</h2>
                <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={countryData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                        <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                        <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={90} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#6366f1" radius={[0, 6, 6, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
