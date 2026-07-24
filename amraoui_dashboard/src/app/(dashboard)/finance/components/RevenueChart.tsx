"use client";

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const RevenueChart = ({ data = [] }: { data?: any[] }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 h-[350px]">
      <h3 className="font-bold text-gray-900 mb-6">Revenue Trend (Last 30 Days)</h3>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis dataKey="name" axisLine={true} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
            <YAxis axisLine={true} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dx={-10} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', marginTop: '10px' }} />
            <Line type="monotone" dataKey="Revenue" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4, fill: '#3B82F6' }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="Payouts" stroke="#10B981" strokeWidth={2} dot={{ r: 4, fill: '#10B981' }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="Margin" stroke="#06B6D4" strokeWidth={2} dot={{ r: 4, fill: '#06B6D4' }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
