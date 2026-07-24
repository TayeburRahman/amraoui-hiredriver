/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export const PaymentStatusChart = ({ data = [] }: { data?: any[] }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 h-[350px]">
      <h3 className="font-bold text-gray-900 mb-2">Payment Status Distribution</h3>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={0}
              outerRadius={100}
              dataKey="value"
              stroke="#fff"
              strokeWidth={2}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: any) => `€${(Number(value) / 1000).toFixed(1)}k`}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            />
            <Legend 
              layout="vertical" 
              verticalAlign="middle" 
              align="right"
              wrapperStyle={{ fontSize: '12px', right: 0 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
