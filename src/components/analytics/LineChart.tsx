import React from 'react';

interface DataPoint {
  date: string;
  value: number;
}

interface LineChartProps {
  data: DataPoint[];
  title: string;
  color?: string;
}

export function LineChart({ data, title, color = '#4F46E5' }: LineChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((d.value - minValue) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  // Format dates for better readability
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Select dates to show (first, middle, and last)
  const displayDates = [
    data[0],
    data[Math.floor(data.length / 2)],
    data[data.length - 1]
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="relative h-64">
        {/* Y-axis values */}
        <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-500">
          <span>{Math.round(maxValue).toLocaleString()}</span>
          <span>{Math.round((maxValue + minValue) / 2).toLocaleString()}</span>
          <span>{Math.round(minValue).toLocaleString()}</span>
        </div>

        {/* Chart area */}
        <div className="ml-12 h-full">
          <svg className="w-full h-[calc(100%-2rem)]" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Grid lines */}
            <line x1="0" y1="0" x2="100" y2="0" stroke="#f3f4f6" strokeWidth="0.5" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="#f3f4f6" strokeWidth="0.5" />
            <line x1="0" y1="100" x2="100" y2="100" stroke="#f3f4f6" strokeWidth="0.5" />
            
            {/* Data line */}
            <polyline
              points={points}
              fill="none"
              stroke={color}
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {/* X-axis dates */}
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            {displayDates.map((d, i) => (
              <span key={i} className="text-center">
                {formatDate(d.date)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}