import React from "react";
import {
  UserIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ChartPieIcon,
} from "@heroicons/react/24/outline";

const cards = [
  { title: "Users", value: 1200, color: "bg-blue-500", icon: UserIcon },
  { title: "Sales", value: 5300, color: "bg-green-500", icon: ChartBarIcon },
  { title: "Revenue", value: "$12,400", color: "bg-yellow-500", icon: CurrencyDollarIcon },
  { title: "Analytics", value: "85%", color: "bg-purple-500", icon: ChartPieIcon },
];

export default function DashboardCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="flex items-center p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className={`${card.color} p-3 rounded-full`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">{card.title}</p>
              <p className="text-gray-900 text-xl font-semibold">{card.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
