import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { PRESTIGE_BADGES } from '../data/badgesData';
import { PROBLEMS_DATA } from '../data/problemsData';

const GamificationContext = createContext(null);

export const GamificationProvider = ({ children }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Initial submission history records showing multi-attempt progression
  const [submissions, setSubmissions] = useState(() => {
    const saved = localStorage.getItem('clv_submissions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.warn('Failed to parse saved submissions');
      }
    }
    
    // Seed initial multi-attempt history records for Problem #101
    return [
      {
        id: 'sub-101-1',
        problemId: 'prob-101',
        problemTitle: 'Sum of Two Integers Logic',
        attemptNumber: 1,
        logicText: '1. Add a and b\n2. Print answer',
        passed: false,
        stars: 1,
        score: 35,
        timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
        explainWhy: {
          missing: 'You skipped initializing input variables.',
          impact: 'Without declaring variables, the calculation has no defined parameters.',
          guidance: 'Add a step declaring input variables A and B.'
        },
        feedback: [
          { step: 'Initialization', status: 'WARN', detail: 'Missing explicit variable declarations.' },
          { step: 'Processing', status: 'FAIL', detail: 'Logic lacks intermediate step sequencing.' }
        ]
      },
      {
        id: 'sub-101-2',
        problemId: 'prob-101',
        problemTitle: 'Sum of Two Integers Logic',
        attemptNumber: 2,
        logicText: '1. Declare integer a=5\n2. Declare integer b=7\n3. Calculate a + b',
        passed: false,
        stars: 2,
        score: 55,
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        explainWhy: {
          missing: 'You skipped creating the result variable and output step.',
          impact: 'Without storing the sum and outputting it, the result is lost upon termination.',
          guidance: 'Add steps to store the sum in a variable and print it.'
        },
        feedback: [
          { step: 'Variable Setup', status: 'PASS', detail: 'Initial parameters detected.' },
          { step: 'Output Generation', status: 'FAIL', detail: 'Missing explicit print step.' }
        ]
      },
      {
        id: 'sub-101-3',
        problemId: 'prob-101',
        problemTitle: 'Sum of Two Integers Logic',
        attemptNumber: 3,
        logicText: '1. declare integer a=5\n2. declare integer b=7\n3. declare integer c=a+b\n4. print c',
        passed: true,
        stars: 4,
        score: 88,
        timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
        explainWhy: {
          missing: 'Intermediate reasoning can be more descriptive.',
          impact: 'Logic formulation is valid and complete.',
          guidance: 'Specify explicit input reading for 100% score.'
        },
        feedback: [
          { step: 'Input & Setup', status: 'PASS', detail: 'Variables initialized.' },
          { step: 'Core Operation', status: 'PASS', detail: 'Expression valid.' },
          { step: 'Output', status: 'PASS', detail: 'Output generated.' }
        ]
      },
      {
        id: 'sub-101-4',
        problemId: 'prob-101',
        problemTitle: 'Sum of Two Integers Logic',
        attemptNumber: 4,
        logicText: '1. Read integer variable A and integer variable B from input.\n2. Declare integer variable sum and store result of adding A and B.\n3. Output the result stored in sum.',
        passed: true,
        stars: 5,
        score: 98,
        timestamp: new Date().toISOString(),
        explainWhy: {
          missing: 'None — Logic formulation is complete.',
          impact: 'Covers initialization, calculation, storage, and output cleanly.',
          guidance: 'Proceed to code generation.'
        },
        feedback: [
          { step: 'Input & Setup', status: 'PASS', detail: 'Variables initialized cleanly.' },
          { step: 'Core Operation', status: 'PASS', detail: 'Operations consistent.' },
          { step: 'Output', status: 'PASS', detail: 'Result outputted.' }
        ]
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('clv_submissions', JSON.stringify(submissions));
  }, [submissions]);

  // Record a new submission attempt
  const recordSubmission = (submissionData) => {
    const newRecord = {
      id: 'sub-' + Date.now(),
      timestamp: new Date().toISOString(),
      ...submissionData
    };
    setSubmissions((prev) => [newRecord, ...(Array.isArray(prev) ? prev : [])]);
  };

  // Generate 365 days heatmap data
  const heatmapData = useMemo(() => {
    const today = new Date();
    const map = {};
    const safeSubmissions = Array.isArray(submissions) ? submissions : [];
    
    safeSubmissions.forEach((sub) => {
      if (sub && sub.passed && sub.timestamp) {
        const dateStr = sub.timestamp.split('T')[0];
        map[dateStr] = (map[dateStr] || 0) + 1;
      }
    });

    const days = [];
    for (let i = 364; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      const count = map[dateStr] || (i % 3 === 0 || i < 15 ? (i % 2 === 0 ? 2 : 1) : 0);
      days.push({
        date: dateStr,
        count,
        isActive: count > 0
      });
    }
    return days;
  }, [submissions]);

  // Compute Overall Accuracy
  const accuracy = useMemo(() => {
    const safeSubmissions = Array.isArray(submissions) ? submissions : [];
    if (safeSubmissions.length === 0) return 92;
    const passedCount = safeSubmissions.filter((s) => s && s.passed).length;
    return Math.round((passedCount / safeSubmissions.length) * 100);
  }, [submissions]);

  // Compute Difficulty breakdown stats
  const difficultyProgress = useMemo(() => {
    const totals = { Easy: 0, Intermediate: 0, Hard: 0 };
    const solved = { Easy: 0, Intermediate: 0, Hard: 0 };
    const safeSubmissions = Array.isArray(submissions) ? submissions : [];

    PROBLEMS_DATA.forEach((p) => {
      totals[p.difficulty] = (totals[p.difficulty] || 0) + 1;
    });

    const solvedIds = new Set(safeSubmissions.filter((s) => s && s.passed).map((s) => s.problemId));
    PROBLEMS_DATA.forEach((p) => {
      if (solvedIds.has(p.id)) {
        solved[p.difficulty] = (solved[p.difficulty] || 0) + 1;
      }
    });

    return {
      easy: { solved: solved.Easy || 2, total: totals.Easy || 3, percent: Math.round(((solved.Easy || 2) / (totals.Easy || 3)) * 100) },
      intermediate: { solved: solved.Intermediate || 1, total: totals.Intermediate || 3, percent: Math.round(((solved.Intermediate || 1) / (totals.Intermediate || 3)) * 100) },
      hard: { solved: solved.Hard || 0, total: totals.Hard || 2, percent: Math.round(((solved.Hard || 0) / (totals.Hard || 2)) * 100) }
    };
  }, [submissions]);

  // Keyboard shortcut listener for Ctrl+K global search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <GamificationContext.Provider
      value={{
        submissions,
        recordSubmission,
        heatmapData,
        accuracy,
        difficultyProgress,
        isSearchOpen,
        setIsSearchOpen,
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
};
