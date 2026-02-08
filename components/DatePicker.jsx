"use client";

import { useState } from "react";

export default function DatePicker({ value, onChange, label, required = false }) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value || "");

  const formatDate = (date) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const handleDateSelect = (date) => {
    const formatted = formatDate(date);
    setSelectedDate(formatted);
    onChange(formatted);
    setShowCalendar(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSelectedDate(value);
    onChange(value);
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const navigateMonth = (direction) => {
    const [month, year] = selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { month: 'numeric', year: 'numeric' }).split('/') : [new Date().getMonth() + 1, new Date().getFullYear()];
    const currentDate = new Date(year, month - 1, 1);
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1);
    setSelectedDate(formatDate(newDate));
  };

  const today = new Date();
  const currentMonth = selectedDate ? new Date(selectedDate) : today;
  const days = getDaysInMonth(currentMonth);

  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-1">
        {label} {required && "*"}
      </label>
      <div className="relative">
        <input
          type="text"
          value={selectedDate}
          onChange={handleInputChange}
          onFocus={() => setShowCalendar(true)}
          placeholder="e.g., Oct 15 - 19, 2025"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
          required={required}
        />
        <button
          type="button"
          onClick={() => setShowCalendar(!showCalendar)}
          className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
        >
          📅
        </button>
      </div>

      {showCalendar && (
        <div className="absolute z-50 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <button
              type="button"
              onClick={() => navigateMonth(-1)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              ‹
            </button>
            <div className="font-medium">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
            <button
              type="button"
              onClick={() => navigateMonth(1)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              ›
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-xs">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} className="text-center font-medium text-gray-500 p-2">
                {day}
              </div>
            ))}
            {days.map((day, index) => (
              <div key={index} className="text-center p-2">
                {day ? (
                  <button
                    type="button"
                    onClick={() => handleDateSelect(day)}
                    className={`w-8 h-8 rounded hover:bg-emerald-100 focus:bg-emerald-500 focus:text-white ${
                      day.toDateString() === today.toDateString() ? 'bg-emerald-500 text-white' : ''
                    }`}
                  >
                    {day.getDate()}
                  </button>
                ) : (
                  <div className="w-8 h-8" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
