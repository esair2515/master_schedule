import React, { useState } from 'react';
import { Calendar, Clock, Book, Dumbbell, Target, ChevronRight, ChevronDown, Check } from 'lucide-react';

const EnhancedSchedule = () => {
  const [expandedWeeks, setExpandedWeeks] = useState(new Set([1]));
  const [expandedDays, setExpandedDays] = useState(new Set());
  const [completedTasks, setCompletedTasks] = useState(new Set());

  const toggleWeek = (week) => {
    const newExpanded = new Set(expandedWeeks);
    if (newExpanded.has(week)) {
      newExpanded.delete(week);
    } else {
      newExpanded.add(week);
    }
    setExpandedWeeks(newExpanded);
  };

  const toggleDay = (dayKey) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(dayKey)) {
      newExpanded.delete(dayKey);
    } else {
      newExpanded.add(dayKey);
    }
    setExpandedDays(newExpanded);
  };

  const toggleTask = (taskId) => {
    const newCompleted = new Set(completedTasks);
    if (newCompleted.has(taskId)) {
      newCompleted.delete(taskId);
    } else {
      newCompleted.add(taskId);
    }
    setCompletedTasks(newCompleted);
  };

  // Convert 24hr to 12hr format
  const convertTo12Hour = (time24) => {
    if (time24.includes('-')) {
      const [start, end] = time24.split('-');
      return `${convertSingleTime(start)}-${convertSingleTime(end)}`;
    }
    return convertSingleTime(time24);
  };

  const convertSingleTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Workout rotation
  const workoutPlan = {
    'Day 1': 'Chest + Triceps',
    'Day 2': 'Back + Biceps', 
    'Day 3': 'Legs + Core',
    'Day 4': 'Shoulders + Arms',
    'Rest': 'Rest Day'
  };

  const getWorkoutForDate = (date) => {
    const startDate = new Date('2025-05-20'); // Starting Tuesday
    const diffTime = Math.abs(date - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const cycle = diffDays % 5;
    
    if (cycle === 0 || cycle === 4) return workoutPlan['Rest'];
    return workoutPlan[`Day ${cycle}`];
  };

  const isPracticeTestDay = (date) => {
    const startDate = new Date('2025-05-20');
    const diffTime = Math.abs(date - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays % 2 === 0; // Every other day
  };

  const createDetailedSchedule = () => {
    const schedule = {};
    const startDate = new Date('2025-05-20'); // Starting Tuesday 5/20/2025
    const endDate = new Date('2025-08-23');
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const dayOfWeek = d.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isSchoolDay = d < new Date('2025-07-18') && !isWeekend;
      const isFinals = d >= new Date('2025-07-11') && d <= new Date('2025-07-18') && !isWeekend;
      const isSummerInternship = d >= new Date('2025-06-16') && d <= new Date('2025-06-20') && !isWeekend;
      
      // Determine schedule based on day type
      let dailySchedule = [];
      
      if (isSchoolDay) {
        // School days
        const isEarlyRelease = dayOfWeek === 2; // Tuesday
        const returnTime = isEarlyRelease ? '15:30' : '15:00';
        const decompressEnd = isEarlyRelease ? '15:45' : '15:15';
        const studyEnd = isEarlyRelease ? '16:45' : '16:15';
        const mathEnd = isEarlyRelease ? '17:30' : '17:00';
        const satEnd = isEarlyRelease ? '18:30' : '18:00';
        
        dailySchedule = [
          { time: '06:30-15:00', activity: 'School', type: 'school', icon: '🏫' },
          { time: `${returnTime}-${decompressEnd}`, activity: 'Decompress & Bathroom', type: 'break', icon: '😌' },
          { time: `${decompressEnd}-${studyEnd}`, activity: 'Study School Work', type: 'study', icon: '📚' },
          { time: `${studyEnd}-${mathEnd}`, activity: 'SAT Question Bank (Math)', type: 'sat', icon: '🧮' },
          { time: `${mathEnd}-${satEnd}`, activity: isPracticeTestDay(d) ? 'SAT Full Practice Test' : 'SAT Reading Practice', type: 'sat', icon: '📝' },
          { time: '18:30-19:00', activity: 'Pre-dinner Prep', type: 'break', icon: '🍽️' },
          { time: '19:00-20:30', activity: 'Dinner + Chores', type: 'daily', icon: '🍽️' },
          { time: '20:30-21:30', activity: getWorkoutForDate(d), type: 'workout', icon: '💪' },
          { time: '21:30-22:00', activity: 'Shower & Wind Down', type: 'break', icon: '🚿' }
        ];

        // Add summer internship if applicable
        if (isSummerInternship) {
          dailySchedule = [
            { time: '06:30-15:00', activity: 'School', type: 'school', icon: '🏫' },
            { time: `${returnTime}-${decompressEnd}`, activity: 'Decompress & Bathroom', type: 'break', icon: '😌' },
            { time: `${decompressEnd}-16:00`, activity: 'Quick Study/Homework', type: 'study', icon: '📚' },
            { time: '16:00-18:45', activity: 'Summer Internship', type: 'internship', icon: '💼' },
            { time: '18:45-19:00', activity: 'Transition to Dinner', type: 'break', icon: '🚶' },
            { time: '19:00-20:30', activity: 'Dinner + Chores', type: 'daily', icon: '🍽️' },
            { time: '20:30-21:30', activity: getWorkoutForDate(d), type: 'workout', icon: '💪' },
            { time: '21:30-22:00', activity: 'Shower & Wind Down', type: 'break', icon: '🚿' }
          ];
        }
        
        if (isFinals) {
          dailySchedule[2] = { time: `${decompressEnd}-${satEnd}`, activity: 'Finals Study (Priority)', type: 'study', icon: '📖' };
          dailySchedule[3] = { time: `${satEnd}-18:30`, activity: 'SAT Light Review', type: 'sat', icon: '📝' };
          dailySchedule.splice(4, 1); // Remove the extra SAT slot
        }
      } else {
        // Weekend days
        const wakeTime = d < new Date('2025-06-01') ? '08:00' : '07:00';
        const breakfastEnd = wakeTime === '08:00' ? '08:15' : '07:15';
        const internshipEnd = wakeTime === '08:00' ? '10:15' : '09:15';
        const satEnd = wakeTime === '08:00' ? '11:45' : '10:45';
        const workoutEnd = wakeTime === '08:00' ? '12:45' : '11:45';
        const showerEnd = wakeTime === '08:00' ? '13:00' : '12:00';
        
        dailySchedule = [
          { time: `${wakeTime}-${breakfastEnd}`, activity: 'Wake Up + Breakfast', type: 'daily', icon: '🌅' },
          { time: `${breakfastEnd}-${internshipEnd}`, activity: 'Internship Work (2 hours)', type: 'internship', icon: '💼' },
          { time: `${internshipEnd}-${satEnd}`, activity: 'SAT Question Bank (Math + Reading)', type: 'sat', icon: '📝' },
          { time: `${satEnd}-${workoutEnd}`, activity: getWorkoutForDate(d), type: 'workout', icon: '💪' },
          { time: `${workoutEnd}-${showerEnd}`, activity: 'Shower', type: 'break', icon: '🚿' },
          { time: '13:00-14:00', activity: 'Free Time', type: 'break', icon: '😎' },
          { time: '14:00-15:00', activity: 'Lunch', type: 'daily', icon: '🥪' },
          { time: '15:00-17:00', activity: isPracticeTestDay(d) ? 'SAT Full Practice Test' : 'SAT Review + Desmos Tips', type: 'sat', icon: '📊' },
          { time: '17:00-19:00', activity: 'Free Time / Relax', type: 'break', icon: '🎮' },
          { time: '19:00-20:30', activity: 'Dinner + Family Time', type: 'daily', icon: '🍽️' },
          { time: '20:30-22:00', activity: 'Free Time', type: 'break', icon: '📺' },
          { time: '22:00-22:30', activity: 'Wind Down', type: 'break', icon: '📖' }
        ];
      }
      
      schedule[dateStr] = {
        date: d.toDateString(),
        dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek],
        isWeekend,
        isSchoolDay,
        isFinals,
        isSummerInternship,
        workout: getWorkoutForDate(d),
        practiceTest: isPracticeTestDay(d),
        schedule: dailySchedule
      };
    }
    
    return schedule;
  };

  const schedule = createDetailedSchedule();
  const dates = Object.keys(schedule).sort();
  
  // Group by weeks - handle the first partial week starting on Tuesday
  const weeks = [];
  let currentWeek = [];
  
  dates.forEach((date, index) => {
    const dayOfWeek = new Date(date).getDay();
    
    // If it's the first date (Tuesday 5/20) or we're starting a new Monday
    if (index === 0 || (dayOfWeek === 1 && currentWeek.length > 0)) {
      if (currentWeek.length > 0) {
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
    }
    
    currentWeek.push(date);
    
    // If it's the last date, push the remaining week
    if (index === dates.length - 1) {
      weeks.push([...currentWeek]);
    }
  });

  const getTypeColor = (type) => {
    const colors = {
      school: 'bg-blue-100 text-blue-800',
      study: 'bg-green-100 text-green-800',
      sat: 'bg-purple-100 text-purple-800',
      workout: 'bg-red-100 text-red-800',
      internship: 'bg-orange-100 text-orange-800',
      daily: 'bg-gray-100 text-gray-800',
      break: 'bg-yellow-100 text-yellow-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Enhanced Master Schedule</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border">
            <div className="flex items-center mb-2">
              <Calendar className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="font-semibold text-blue-800">Schedule Overview</h3>
            </div>
            <p className="text-sm text-blue-700">
              May 20 - August 23, 2025<br/>
              School ends July 18<br/>
              Finals: July 11-18<br/>
              Summer Internship: June 16-20
            </p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg border">
            <div className="flex items-center mb-2">
              <Target className="w-5 h-5 text-purple-600 mr-2" />
              <h3 className="font-semibold text-purple-800">SAT Prep</h3>
            </div>
            <p className="text-sm text-purple-700">
              • Practice test every other day<br/>
              • Daily question banks<br/>
              • Weekly Desmos tips<br/>
              • Reading practice sessions
            </p>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg border">
            <div className="flex items-center mb-2">
              <Dumbbell className="w-5 h-5 text-red-600 mr-2" />
              <h3 className="font-semibold text-red-800">Workout Plan</h3>
            </div>
            <p className="text-sm text-red-700">
              4-day split rotation:<br/>
              Chest+Triceps → Back+Biceps → Legs+Core → Shoulders+Arms → Rest
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="border rounded-lg overflow-hidden">
            <button
              onClick={() => toggleWeek(weekIndex + 1)}
              className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors"
            >
              <span className="font-semibold text-gray-800">
                Week {weekIndex + 1} ({schedule[week[0]].date} - {schedule[week[week.length - 1]].date})
              </span>
              {expandedWeeks.has(weekIndex + 1) ? (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-600" />
              )}
            </button>
            
            {expandedWeeks.has(weekIndex + 1) && (
              <div className="p-4 space-y-3">
                {week.map(date => {
                  const day = schedule[date];
                  const dayKey = `${weekIndex}-${date}`;
                  
                  return (
                    <div key={date} className="border rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleDay(dayKey)}
                        className="w-full px-3 py-2 bg-white hover:bg-gray-50 flex items-center justify-between transition-colors border-b"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="font-medium text-gray-800">
                            {day.dayOfWeek} - {new Date(date).toLocaleDateString()}
                          </span>
                          <div className="flex space-x-2">
                            {day.isSchoolDay && <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">School</span>}
                            {day.isFinals && <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">Finals</span>}
                            {day.isSummerInternship && <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">Internship</span>}
                            {day.practiceTest && <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">Practice Test</span>}
                          </div>
                        </div>
                        {expandedDays.has(dayKey) ? (
                          <ChevronDown className="w-4 h-4 text-gray-600" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-600" />
                        )}
                      </button>
                      
                      {expandedDays.has(dayKey) && (
                        <div className="p-3 bg-gray-50">
                          <div className="grid gap-2">
                            {day.schedule.map((item, index) => {
                              const taskId = `${date}-${index}`;
                              const isCompleted = completedTasks.has(taskId);
                              
                              return (
                                <div key={index} className={`p-3 rounded-lg border ${getTypeColor(item.type)} ${isCompleted ? 'opacity-60' : ''}`}>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      <button
                                        onClick={() => toggleTask(taskId)}
                                        className={`w-5 h-5 rounded border-2 transition-colors ${
                                          isCompleted 
                                            ? 'bg-green-500 border-green-500 text-white' 
                                            : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                      >
                                        {isCompleted && <Check className="w-3 h-3" />}
                                      </button>
                                      <span className="text-lg">{item.icon}</span>
                                      <span className="font-medium">{convertTo12Hour(item.time)}</span>
                                    </div>
                                    <span className={`text-sm font-semibold ${isCompleted ? 'line-through' : ''}`}>
                                      {item.activity}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          
                          {day.workout !== 'Rest Day' && (
                            <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                              <h4 className="font-semibold text-red-800 mb-2">💪 Today's Workout: {day.workout}</h4>
                              <div className="text-sm text-red-700">
                                {day.workout === 'Chest + Triceps' && (
                                  <div>Push-Ups (4×max) • Slow Negative Push-Ups (3×8) • Dips (4×10-12) • DB Floor Press (3×12-15) • DB Tricep Extension (3×12-15) • Diamond Push-Ups (3×burnout)</div>
                                )}
                                {day.workout === 'Back + Biceps' && (
                                  <div>Towel Rows (4×10) • Backpack Rows (4×12) • DB Bicep Curls (3×15-20) • Isometric Hold (3×20s) • Reverse Angels (3×15) • Doorframe Pulls (3×12)</div>
                                )}
                                {day.workout === 'Legs + Core' && (
                                  <div>Squats (4×15-20) • Bulgarian Split Squats (3×10/leg) • Wall Sits (3×45s) • Calf Raises (4×20) • Plank (3×60s) • Leg Raises (3×15) • Russian Twists (3×20)</div>
                                )}
                                {day.workout === 'Shoulders + Arms' && (
                                  <div>Pike Push-Ups (3×10-15) • DB Lateral Raises (3×15) • Front Raises (3×15) • Backpack Overhead Press (4×10-12) • DB Curls (3×12) • Chair Dips (3×15)</div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border">
        <h3 className="font-semibold text-blue-800 mb-2">📋 Schedule Notes:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• School days: Return at 3:00 PM (3:30 PM on Tuesdays)</li>
          <li>• Always decompress 10-15 minutes after school</li>
          <li>• Dinner at 7:00 PM, chores until 8:30 PM</li>
          <li>• Bedtime: 10:00 PM on school nights, 10:30-11:00 PM on weekends</li>
          <li>• Weekend wake-up: 8:00 AM initially, then 7:00 AM after June 1st</li>
          <li>• 2 hours internship work daily</li>
          <li>• Practice tests every other day, question banks daily</li>
          <li>• 4-day workout rotation with rest days</li>
          <li>• Click checkboxes to track completed tasks!</li>
        </ul>
      </div>
    </div>
  );
};

export default EnhancedSchedule;
