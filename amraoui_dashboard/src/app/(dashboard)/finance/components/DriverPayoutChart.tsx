"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const DriverPayoutChart = ({ data = [] }: { data?: any[] }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
      <h3 className="font-bold text-gray-900 mb-6">Driver Payout Status</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            barSize={120}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={1}/>
                <stop offset="95%" stopColor="#06B6D4" stopOpacity={1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis dataKey="name" axisLine={true} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
            <YAxis axisLine={true} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dx={-10} ticks={[0, 20000, 40000, 60000, 80000]} />
            <Tooltip 
              cursor={{fill: 'transparent'}}
              contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              formatter={(value: any) => `€${value?.toLocaleString() ?? 0}`}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {
                data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="url(#colorValue)" />
                ))
              }
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
