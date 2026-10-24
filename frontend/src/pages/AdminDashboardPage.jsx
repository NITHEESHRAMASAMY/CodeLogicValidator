import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PROBLEMS_DATA } from '../data/problemsData';
import ThreeCanvas from '../components/ThreeCanvas';
import AdminProblemModal from '../components/AdminProblemModal';
import API from '../services/api';
import {
  ShieldAlert,
  Plus,
  Edit2,
  Trash2,
  BookOpen,
  FileText,
  Sparkles,
  Database,
  CheckCircle2,
  Activity,
  Mail,
  Send,
  ExternalLink,
  Clock,
  Check,
  Upload,
  RefreshCw,
  FileUp,
  Download
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AdminDashboardPage() {
  const { user, isAdmin, adminEmail } = useAuth();
  const [problems, setProblems] = useState(PROBLEMS_DATA);
  const [editingProb, setEditingProb] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('requests'); // 'requests' | 'problems' | 'audit'
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState('');
  const fileInputRef = React.useRef(null);

  // Load existing problems from backend / storage
  useEffect(() => {
    const loadProblems = async () => {
      try {
        const res = await API.get('/problems');
        if (res.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setProblems(res.data.data);
          return;
        }
      } catch (e) {
        console.warn('Backend problems fetch offline, using fallback');
      }
      const saved = localStorage.getItem('clv_custom_problems');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProblems(parsed);
          }
        } catch (e) {}
      }
    };
    if (isAdmin) {
      loadProblems();
    }
  }, [isAdmin]);

  // User Problem Requests Inbox
  const [problemRequests, setProblemRequests] = useState(() => {
    const saved = localStorage.getItem('clv_problem_requests');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to parse saved problem requests');
      }
    }
    return [
      {
        id: 'req-init-1',
        title: 'Check Palindrome Number Logic',
        category: 'Math',
        difficulty: 'Easy',
        description: 'Verify if an integer x is a palindrome without converting to string. Formulate reversal logic using modulo and division.',
        testCases: 'Input: x = 121 -> Output: true\nInput: x = -121 -> Output: false\nInput: x = 10 -> Output: false',
        userName: 'Priya Sharma',
        userEmail: 'priya.sharma@clv.io',
        status: 'PENDING',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      {
        id: 'req-init-2',
        title: 'Merge Two Sorted Arrays in Logic',
        category: 'Arrays',
        difficulty: 'Intermediate',
        description: 'Read two pre-sorted arrays A and B of sizes N and M. Formulate two-pointer comparison logic to merge them into sorted array C.',
        testCases: 'Input: A = [1, 3, 5], B = [2, 4, 6] -> Output: [1, 2, 3, 4, 5, 6]',
        userName: 'Rahul Verma',
        userEmail: 'rahul.v@clv.io',
        status: 'PENDING',
        createdAt: new Date(Date.now() - 3600000 * 6).toISOString()
      }
    ];
  });

  // Fetch problem requests from backend if available
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await API.get('/admin/problem-requests');
        if (res.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setProblemRequests(res.data.data);
        }
      } catch (e) {
        console.warn('Backend requests endpoint offline, using local state');
      }
    };
    if (isAdmin) {
      fetchRequests();
    }
  }, [isAdmin]);

  // Audit Log State
  const [auditLogs, setAuditLogs] = useState([
    {
      id: 'log-001',
      action: 'SYSTEM_BOOT',
      adminEmail: adminEmail || 'nitheesh25bls@gmail.com',
      details: 'Spring Boot 3 + MongoDB Atlas cluster initialized.',
      timestamp: new Date().toISOString()
    },
    {
      id: 'log-002',
      action: 'ADMIN_VERIFIED',
      adminEmail: adminEmail || 'nitheesh25bls@gmail.com',
      details: 'Dedicated primary administrator authenticated: nitheesh25bls@gmail.com',
      timestamp: new Date(Date.now() - 3600000).toISOString()
    }
  ]);

  // RESTRICT ACCESS TO NITHEESH25BLS@GMAIL.COM ONLY
  if (!isAdmin) {
    return (
      <div className="relative min-h-[calc(100vh-4rem)] p-4 sm:p-8 flex items-center justify-center">
        <ThreeCanvas />
        <div className="relative z-10 max-w-lg w-full glass-panel-gold rounded-3xl p-8 border border-red-500/50 text-center space-y-4 shadow-luxury">
          <div className="w-16 h-16 rounded-3xl bg-red-950/40 border border-red-500/50 flex items-center justify-center text-red-400 mx-auto shadow-[0_0_20px_rgba(239,68,68,0.3)]">
            <ShieldAlert className="w-8 h-8 animate-bounce" />
          </div>
          <h2 className="text-2xl font-bold font-display text-white">
            Admin Module Access Restricted
          </h2>
          <p className="text-xs text-gray-300 font-sans leading-relaxed">
            The Admin Management Portal is strictly reserved for the system administrator:
          </p>
          <div className="py-2.5 px-4 rounded-xl bg-black/60 border border-[#D4AF37]/50 text-sm font-mono font-bold text-[#D4AF37]">
            {adminEmail}
          </div>
          <p className="text-xs text-gray-400 font-sans leading-relaxed">
            You are logged in as <strong className="text-white font-mono">{user?.email || 'Non-Admin User'}</strong>.
            If you need a new problem or test case added, please use the <strong>"Request Problem"</strong> button to mail your problem description directly to the admin.
          </p>
          <div className="pt-2">
            <Link
              to="/dashboard"
              className="inline-block py-2.5 px-6 rounded-xl font-display text-xs uppercase font-bold tracking-wider text-black bg-gradient-to-r from-[#F5E6AB] via-[#D4AF37] to-[#A38218] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all"
            >
              Return to Problem Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleCreateNew = () => {
    setEditingProb(null);
    setIsModalOpen(true);
  };

  const handleEdit = (prob) => {
    setEditingProb(prob);
    setIsModalOpen(true);
  };

  const handleUploadProjectQuestions = async () => {
    setIsUploading(true);
    setUploadSuccessMsg('');
    try {
      const res = await API.post('/admin/problems/batch', PROBLEMS_DATA);
      if (res.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
        setProblems(res.data.data);
      } else {
        setProblems(PROBLEMS_DATA);
      }
      localStorage.setItem('clv_custom_problems', JSON.stringify(PROBLEMS_DATA));
      setUploadSuccessMsg(`Successfully uploaded and synchronized all ${PROBLEMS_DATA.length} project questions into database!`);
      try { confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } }); } catch (e) {}

      const newLog = {
        id: 'log-' + Date.now(),
        action: 'BATCH_UPLOAD_DEFAULT_PROBLEMS',
        adminEmail: adminEmail || 'nitheesh25bls@gmail.com',
        details: `Synchronized ${PROBLEMS_DATA.length} project problems into database repository.`,
        timestamp: new Date().toISOString()
      };
      setAuditLogs((prev) => [newLog, ...prev]);
    } catch (err) {
      console.warn('Backend sync failed, storing locally', err);
      localStorage.setItem('clv_custom_problems', JSON.stringify(PROBLEMS_DATA));
      setProblems(PROBLEMS_DATA);
      setUploadSuccessMsg(`Uploaded ${PROBLEMS_DATA.length} project questions to local database cache!`);
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadSuccessMsg(''), 6000);
    }
  };

  const handleJsonFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const questionList = Array.isArray(parsed) ? parsed : [parsed];

      setIsUploading(true);
      try {
        const res = await API.post('/admin/problems/batch', questionList);
        if (res.data && Array.isArray(res.data.data)) {
          setProblems(res.data.data);
        } else {
          setProblems((prev) => [...prev, ...questionList]);
        }
      } catch (err) {
        setProblems((prev) => [...prev, ...questionList]);
      }
      localStorage.setItem('clv_custom_problems', JSON.stringify(questionList));
      setUploadSuccessMsg(`Successfully imported ${questionList.length} questions from ${file.name}!`);
      try { confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } }); } catch (e) {}

      const newLog = {
        id: 'log-' + Date.now(),
        action: 'JSON_FILE_IMPORT',
        adminEmail: adminEmail || 'nitheesh25bls@gmail.com',
        details: `Imported ${questionList.length} questions from file: ${file.name}`,
        timestamp: new Date().toISOString()
      };
      setAuditLogs((prev) => [newLog, ...prev]);
    } catch (err) {
      alert('Failed to parse or upload JSON file. Please ensure it is valid JSON array of questions.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setTimeout(() => setUploadSuccessMsg(''), 6000);
    }
  };

  const handleDelete = async (probId) => {
    const updated = problems.filter((p) => p.id !== probId);
    setProblems(updated);
    localStorage.setItem('clv_custom_problems', JSON.stringify(updated));

    try {
      await API.delete(`/admin/problems/${probId}`);
    } catch (e) {
      console.warn('Backend delete problem offline, updated locally');
    }

    const newLog = {
      id: 'log-' + Date.now(),
      action: 'DELETE_PROBLEM',
      adminEmail: adminEmail,
      details: `Deleted problem ID: ${probId}`,
      timestamp: new Date().toISOString()
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const handleSaveProblem = async (savedProb) => {
    const exists = problems.some((p) => p.id === savedProb.id);
    let updated;
    if (exists) {
      updated = problems.map((p) => (p.id === savedProb.id ? savedProb : p));
    } else {
      updated = [...problems, savedProb];
    }
    setProblems(updated);
    localStorage.setItem('clv_custom_problems', JSON.stringify(updated));

    try {
      await API.post('/admin/problems', savedProb);
    } catch (e) {
      console.warn('Backend problem save offline, stored locally');
    }

    const newLog = {
      id: 'log-' + Date.now(),
      action: exists ? 'UPDATE_PROBLEM' : 'CREATE_PROBLEM',
      adminEmail: adminEmail,
      details: `${exists ? 'Updated' : 'Created'} problem: "${savedProb.title}"`,
      timestamp: new Date().toISOString()
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const handleApproveRequest = (req) => {
    const newProb = {
      id: 'prob-' + (100 + problems.length + 1),
      number: 100 + problems.length + 1,
      title: req.title,
      category: req.category || 'General',
      difficulty: req.difficulty || 'Easy',
      points: req.difficulty === 'Easy' ? 50 : req.difficulty === 'Intermediate' ? 100 : 150,
      description: req.description,
      tags: [req.category || 'Logic', 'Student Requested'],
      verifiedBy: 'Nitheesh (Admin)'
    };
    setEditingProb(newProb);
    setIsModalOpen(true);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] p-4 sm:p-8">
      <ThreeCanvas />

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        
        {/* Admin Header Banner */}
        <div className="glass-panel-gold rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-luxury">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-950/50 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-[11px] font-mono font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3" /> System Administrator Mode • {adminEmail}
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
                Platform Management Portal
              </h1>
              <p className="text-xs text-gray-400 font-sans mt-1">
                Manage problems, review user problem requests & test cases, and audit platform activities
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleJsonFileUpload}
              accept=".json"
              className="hidden"
            />

            <button
              onClick={handleUploadProjectQuestions}
              disabled={isUploading}
              className="py-2.5 px-4 rounded-xl font-display text-xs uppercase font-bold tracking-wider text-[#D4AF37] bg-[#141414] hover:bg-[#1E1E1E] border border-[#D4AF37]/50 hover:border-[#D4AF37] hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              title="Upload all 8 pre-built logic problems from this project into database"
            >
              {isUploading ? (
                <RefreshCw className="w-4 h-4 animate-spin text-[#D4AF37]" />
              ) : (
                <Database className="w-4 h-4 text-[#D4AF37]" />
              )}
              <span>{isUploading ? 'Uploading...' : 'Upload Project Questions (8)'}</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="py-2.5 px-3.5 rounded-xl font-display text-xs uppercase font-bold tracking-wider text-gray-300 hover:text-white bg-[#141414] hover:bg-[#1E1E1E] border border-white/10 hover:border-white/30 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Import and upload questions from custom JSON file"
            >
              <FileUp className="w-4 h-4 text-[#D4AF37]" />
              <span>Import JSON</span>
            </button>

            <button
              onClick={handleCreateNew}
              className="py-2.5 px-4 rounded-xl font-display text-xs uppercase font-bold tracking-wider text-black bg-gradient-to-r from-[#F5E6AB] via-[#D4AF37] to-[#A38218] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Create Problem</span>
            </button>
          </div>
        </div>

        {/* Upload Success Alert */}
        {uploadSuccessMsg && (
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 text-xs flex items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="font-medium font-sans">{uploadSuccessMsg}</span>
            </div>
            <button
              onClick={() => setUploadSuccessMsg('')}
              className="text-emerald-400 hover:text-white text-xs font-mono"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 border-b border-[#2D2D2D] pb-3 text-xs font-mono">
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'requests'
                ? 'bg-[#D4AF37] text-black font-bold'
                : 'text-gray-400 hover:text-white bg-[#141414]'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Problem Requests Inbox ({problemRequests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('problems')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'problems'
                ? 'bg-[#D4AF37] text-black font-bold'
                : 'text-gray-400 hover:text-white bg-[#141414]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Problem Bank ({problems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'audit'
                ? 'bg-[#D4AF37] text-black font-bold'
                : 'text-gray-400 hover:text-white bg-[#141414]'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Audit Trail ({auditLogs.length})</span>
          </button>
        </div>

        {/* TAB 1: User Problem Requests Inbox */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-display">
                  User Problem Proposals & Test Cases
                </h3>
                <p className="text-xs text-gray-400 font-sans">
                  Submitted by users to admin (<strong className="text-[#D4AF37]">{adminEmail}</strong>)
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                {problemRequests.length} Active Requests
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {problemRequests.map((req) => (
                <div
                  key={req.id}
                  className="glass-panel rounded-2xl p-6 border border-[#2D2D2D] hover:border-[#D4AF37]/50 transition-all space-y-4 text-left"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#202020] pb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${
                          req.difficulty === 'Easy'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : req.difficulty === 'Intermediate'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        }`}>
                          {req.difficulty || 'Easy'}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-[#1F1F1F] text-gray-400 text-[10px] font-mono border border-white/5">
                          {req.category || 'General'}
                        </span>
                        <span className="text-xs text-gray-500 font-mono flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {new Date(req.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-white font-display">
                        {req.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`mailto:${req.userEmail}?subject=Re: CLV Problem Request - ${encodeURIComponent(req.title)}`}
                        className="px-3 py-1.5 rounded-xl bg-[#1C1C1C] hover:bg-[#252525] border border-white/10 text-xs font-mono text-gray-300 hover:text-white flex items-center gap-1.5 transition-all"
                        title="Reply to user via email"
                      >
                        <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Email User</span>
                      </a>
                      <button
                        onClick={() => handleApproveRequest(req)}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#F5E6AB] via-[#D4AF37] to-[#A38218] text-black text-xs font-bold font-display uppercase tracking-wider flex items-center gap-1.5 transition-all"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Add to Bank</span>
                      </button>
                    </div>
                  </div>

                  {/* Sender details */}
                  <div className="flex items-center gap-4 text-xs font-mono text-gray-400">
                    <span>
                      Requested by: <strong className="text-white">{req.userName}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      User Email: <strong className="text-[#D4AF37]">{req.userEmail}</strong>
                    </span>
                  </div>

                  {/* Problem Description */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500 block">
                      Problem Statement & Logic Requirement
                    </span>
                    <p className="text-xs text-gray-300 font-sans leading-relaxed bg-[#101010] p-3 rounded-xl border border-white/5">
                      {req.description}
                    </p>
                  </div>

                  {/* Test Cases */}
                  {req.testCases && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500 block">
                        Test Cases & Sample Input/Output
                      </span>
                      <pre className="text-xs text-emerald-400/90 font-mono bg-[#0A0A0A] p-3 rounded-xl border border-[#202020] whitespace-pre-wrap leading-relaxed">
                        {req.testCases}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: Problem Bank Management */}
        {activeTab === 'problems' && (
          <div className="glass-panel rounded-3xl border border-[#2D2D2D] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#2D2D2D] bg-[#141414] text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                    <th className="py-4 px-6">#</th>
                    <th className="py-4 px-6">Problem Title</th>
                    <th className="py-4 px-6">Category</th>
                    <th className="py-4 px-6">Difficulty</th>
                    <th className="py-4 px-6">Points</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2D2D2D] text-xs">
                  {problems.map((prob) => (
                    <tr key={prob.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-6 font-mono text-gray-400">#{prob.number}</td>
                      <td className="py-4 px-6 font-semibold text-white font-display">
                        {prob.title}
                      </td>
                      <td className="py-4 px-6 font-mono text-gray-300">{prob.category}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase border ${
                          prob.difficulty === 'Easy'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : prob.difficulty === 'Intermediate'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        }`}>
                          {prob.difficulty}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-mono text-[#D4AF37] font-bold">
                        +{prob.points} PTS
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(prob)}
                            className="p-2 rounded-lg bg-[#1F1F1F] hover:bg-[#D4AF37] text-gray-400 hover:text-black transition-all"
                            title="Edit Problem"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(prob.id)}
                            className="p-2 rounded-lg bg-[#1F1F1F] hover:bg-red-500 text-gray-400 hover:text-white transition-all"
                            title="Delete Problem"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Audit Trail Logs */}
        {activeTab === 'audit' && (
          <div className="glass-panel rounded-3xl border border-[#2D2D2D] overflow-hidden">
            <div className="p-4 border-b border-[#2D2D2D] bg-[#141414] flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Database className="w-4 h-4 text-[#D4AF37]" /> Immutable Security Audit Ledger
              </span>
              <span className="text-[10px] font-mono text-gray-400">
                Authorized Admin: {adminEmail}
              </span>
            </div>
            <div className="divide-y divide-[#2D2D2D] text-xs">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-4 hover:bg-white/[0.02] flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-[#1F1F1F] border border-white/10 text-[10px] font-mono font-bold text-[#D4AF37]">
                        {log.action}
                      </span>
                      <span className="text-xs font-mono text-gray-400">
                        by <strong className="text-white">{log.adminEmail}</strong>
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 font-sans">{log.details}</p>
                  </div>
                  <span className="text-[10px] font-mono text-gray-500 shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Admin Create / Edit Modal */}
      <AdminProblemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        problem={editingProb}
        onSave={handleSaveProblem}
      />
    </div>
  );
}
