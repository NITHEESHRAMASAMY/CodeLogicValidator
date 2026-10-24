import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { PROBLEMS_DATA } from '../data/problemsData';
import ThreeCanvas from '../components/ThreeCanvas';
import {
  Users,
  Shield,
  Key,
  Trophy,
  Play,
  Download,
  Send,
  Plus,
  Lock,
  Sparkles,
  CheckCircle2,
  Clock,
  MessageSquare,
  Award,
  BookOpen,
  UserCheck,
  FileText
} from 'lucide-react';

export default function ClassroomPage() {
  const { user } = useAuth();
  
  // Room State
  const [activeRoom, setActiveRoom] = useState(null); // null if not in a room
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [newRoomName, setNewRoomName] = useState('');
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [userRole, setUserRole] = useState('TEACHER'); // 'TEACHER' | 'STUDENT'

  // Competition State
  const [isCompetitionActive, setIsCompetitionActive] = useState(false);
  const [competitionTimer, setCompetitionTimer] = useState(600); // 10 mins in seconds
  const [selectedProbId, setSelectedProbId] = useState('prob-101');

  // In-room Chat State
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'c-1',
      senderName: 'Teacher (Admin)',
      role: 'TEACHER',
      text: 'Welcome students! Please review problem #101 before we launch our 10-minute logic competition.',
      timestamp: '04:00 PM'
    }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Sample Roster Data (Max 60 members cap)
  const [roster, setRoster] = useState([
    { id: 's-1', name: 'Alexander Wright', role: 'TEACHER', points: 450, accuracy: 98, status: 'ONLINE' },
    { id: 's-2', name: 'Sophia Chen', role: 'STUDENT', points: 380, accuracy: 94, status: 'SOLVING' },
    { id: 's-3', name: 'Liam Patel', role: 'STUDENT', points: 340, accuracy: 89, status: 'SOLVING' },
    { id: 's-4', name: 'Emma Davis', role: 'STUDENT', points: 310, accuracy: 87, status: 'ONLINE' },
    { id: 's-5', name: 'Noah Miller', role: 'STUDENT', points: 290, accuracy: 82, status: 'ONLINE' },
    { id: 's-6', name: 'Ava Wilson', role: 'STUDENT', points: 270, accuracy: 80, status: 'OFFLINE' }
  ]);

  // Create Room as Teacher Admin
  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;

    const generatedCode = 'CLV-' + Math.floor(100000 + Math.random() * 900000);
    const newRoom = {
      id: 'room-' + Date.now(),
      name: newRoomName,
      code: generatedCode,
      capacity: 60,
      adminName: user?.fullName || 'Teacher Admin',
      createdDate: new Date().toLocaleDateString()
    };

    setActiveRoom(newRoom);
    setUserRole('TEACHER');
    setIsCreatingRoom(false);
  };

  // Join Room using Private Code
  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (!joinCodeInput.trim()) return;

    const joinedRoom = {
      id: 'room-joined',
      name: 'Grade 10 Logic Academy - Section A',
      code: joinCodeInput.toUpperCase(),
      capacity: 60,
      adminName: 'Prof. Anderson',
      createdDate: new Date().toLocaleDateString()
    };

    // Check capacity limit
    if (roster.length >= 60) {
      alert('Room capacity reached! This classroom is strictly capped at 60 members.');
      return;
    }

    setActiveRoom(joinedRoom);
    setUserRole('STUDENT');

    // Add current user to roster
    const newStudent = {
      id: 's-' + Date.now(),
      name: user?.fullName || 'New Student',
      role: 'STUDENT',
      points: 0,
      accuracy: 0,
      status: 'ONLINE'
    };
    setRoster((prev) => [...prev, newStudent]);
  };

  // Start Competition
  const handleStartCompetition = () => {
    setIsCompetitionActive(true);
    setCompetitionTimer(600);

    const announcement = {
      id: 'c-' + Date.now(),
      senderName: 'SYSTEM',
      role: 'SYSTEM',
      text: '🚀 Logic Competition Launched! You have 10 minutes to solve the challenge.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages((prev) => [...prev, announcement]);
  };

  // Send In-Room Chat Message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg = {
      id: 'c-' + Date.now(),
      senderName: user?.fullName || (userRole === 'TEACHER' ? 'Teacher' : 'Student'),
      role: userRole,
      text: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setChatInput('');
  };

  // Print & Generate PDF Results Scorecard Report
  const handleExportPDF = () => {
    const printWindow = window.open('', '_blank');
    const prob = PROBLEMS_DATA.find((p) => p.id === selectedProbId) || PROBLEMS_DATA[0];

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>CLV Classroom Competition Results</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #111; }
          .header { text-align: center; border-bottom: 3px solid #D4AF37; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-size: 28px; font-weight: bold; color: #B38F10; }
          .subtitle { font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 2px; }
          .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 30px; background: #f9f9f9; padding: 20px; border-radius: 8px; font-size: 14px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; font-size: 13px; }
          th { background-color: #1A1A1A; color: #D4AF37; font-size: 12px; text-transform: uppercase; }
          tr:nth-child(even) { background-color: #f2f2f2; }
          .rank { font-weight: bold; color: #B38F10; }
          .footer { margin-top: 50px; text-align: center; font-size: 11px; color: #888; border-top: 1px solid #eee; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">CODE LOGIC VALIDATOR</div>
          <div class="subtitle">Classroom Competition Scorecard Report</div>
        </div>

        <div class="meta-grid">
          <div><strong>Classroom:</strong> ${activeRoom?.name}</div>
          <div><strong>Room Access Code:</strong> ${activeRoom?.code}</div>
          <div><strong>Instructor (Admin):</strong> ${activeRoom?.adminName}</div>
          <div><strong>Total Participants:</strong> ${roster.length} / 60 Members</div>
          <div><strong>Challenge Problem:</strong> ${prob.title}</div>
          <div><strong>Report Generated:</strong> ${new Date().toLocaleString()}</div>
        </div>

        <h3>🏆 Official Student Leaderboard & Performance Metrics</h3>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Student Name</th>
              <th>Role</th>
              <th>Score Points</th>
              <th>Logic Accuracy</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${roster
              .sort((a, b) => b.points - a.points)
              .map(
                (st, idx) => `
                <tr>
                  <td class="rank">#${idx + 1}</td>
                  <td>${st.name}</td>
                  <td>${st.role}</td>
                  <td>+${st.points} PTS</td>
                  <td>${st.accuracy}%</td>
                  <td>${st.status}</td>
                </tr>
              `
              )
              .join('')}
          </tbody>
        </table>

        <div class="footer">
          Verified by Code Logic Validator Socratic AI Evaluation Engine • Maximum Room Capacity: 60 Members
        </div>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] p-4 sm:p-8">
      <ThreeCanvas />

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        
        {/* Main Header Banner */}
        <div className="glass-panel-gold rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-luxury">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-950/50 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-[11px] font-mono font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3" /> School & Academy LMS
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
                Classroom & Competition Portal
              </h1>
              <p className="text-xs text-gray-400 font-sans mt-1">
                Create private rooms (capped at 60 members), conduct live solving competitions, chat in real time, and export PDF scorecards.
              </p>
            </div>
          </div>

          {activeRoom && (
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-2xl bg-[#141414] border border-[#D4AF37]/50 text-right">
                <span className="text-[10px] font-mono text-gray-400 block uppercase">Room Access Code</span>
                <span className="text-lg font-bold font-mono text-[#D4AF37] tracking-widest">{activeRoom.code}</span>
              </div>
              <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1">
                <UserCheck className="w-4 h-4" /> {roster.length} / 60 Capped
              </span>
            </div>
          )}
        </div>

        {/* State A: No Room Joined (Create or Join Form) */}
        {!activeRoom ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto py-8">
            
            {/* Create Room Card (For Teacher / Admin) */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/40 space-y-6 shadow-2xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
                  <Plus className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-display text-white">Create New Classroom</h3>
                  <p className="text-xs text-gray-400 font-sans mt-1">
                    As an Instructor/Teacher Admin, generate a private room code capped at 60 students.
                  </p>
                </div>

                <form onSubmit={handleCreateRoom} className="space-y-4 pt-2">
                  <div>
                    <label className="text-xs font-mono text-gray-300 block mb-1">Classroom Name:</label>
                    <input
                      type="text"
                      required
                      value={newRoomName}
                      onChange={(e) => setNewRoomName(e.target.value)}
                      placeholder="e.g. Grade 10 Logic Academy - Section A"
                      className="w-full bg-[#141414] text-xs font-mono text-white p-3.5 rounded-xl border border-[#2D2D2D] outline-none focus:border-[#D4AF37] transition-all"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-[#141414] border border-[#2D2D2D] text-[11px] font-mono text-gray-400 flex items-center justify-between">
                    <span>Member Limit:</span>
                    <strong className="text-[#D4AF37]">60 Members Max</strong>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl font-display text-xs uppercase font-bold tracking-wider text-black bg-gradient-to-r from-[#F5E6AB] via-[#D4AF37] to-[#A38218] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all"
                  >
                    Create Classroom Room
                  </button>
                </form>
              </div>
            </div>

            {/* Join Room Card (For Students) */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-[#2D2D2D] space-y-6 shadow-2xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#1F1F1F] border border-white/10 flex items-center justify-center text-white">
                  <Key className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-display text-white">Join Private Classroom</h3>
                  <p className="text-xs text-gray-400 font-sans mt-1">
                    Enter the 6-digit access code provided by your teacher to enter the classroom.
                  </p>
                </div>

                <form onSubmit={handleJoinRoom} className="space-y-4 pt-2">
                  <div>
                    <label className="text-xs font-mono text-gray-300 block mb-1">Private Room Code:</label>
                    <input
                      type="text"
                      required
                      value={joinCodeInput}
                      onChange={(e) => setJoinCodeInput(e.target.value)}
                      placeholder="e.g. CLV-784920"
                      className="w-full bg-[#141414] text-xs font-mono text-white p-3.5 rounded-xl border border-[#2D2D2D] outline-none focus:border-[#D4AF37] transition-all uppercase tracking-wider"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-[#141414] border border-[#2D2D2D] text-[11px] font-mono text-gray-400 flex items-center justify-between">
                    <span>Enrolled Status:</span>
                    <strong className="text-emerald-400">Instant Student Entry</strong>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl font-display text-xs uppercase font-bold tracking-wider text-white bg-[#1F1F1F] hover:bg-[#2A2A2A] border border-[#2D2D2D] hover:border-[#D4AF37] transition-all"
                  >
                    Enter Classroom
                  </button>
                </form>
              </div>
            </div>

          </div>
        ) : (
          /* State B: Active Room Interface */
          <div className="space-y-6">
            
            {/* Top Controller Bar */}
            <div className="glass-panel rounded-3xl p-5 border border-[#2D2D2D] flex flex-wrap items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37]">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono text-[#D4AF37] font-bold">Active Classroom</span>
                  <h2 className="text-lg font-bold font-display text-white">{activeRoom.name}</h2>
                </div>
              </div>

              {/* Competition Controls (Teacher Only) */}
              <div className="flex flex-wrap items-center gap-3">
                {userRole === 'TEACHER' && (
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedProbId}
                      onChange={(e) => setSelectedProbId(e.target.value)}
                      className="bg-[#141414] text-xs font-mono text-[#D4AF37] font-bold p-2.5 rounded-xl border border-[#2D2D2D] outline-none cursor-pointer"
                    >
                      {PROBLEMS_DATA.map((p) => (
                        <option key={p.id} value={p.id}>
                          #{p.number} {p.title}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={handleStartCompetition}
                      disabled={isCompetitionActive}
                      className="py-2.5 px-4 rounded-xl font-display text-xs uppercase font-bold tracking-wider text-black bg-gradient-to-r from-[#F5E6AB] via-[#D4AF37] to-[#A38218] hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>{isCompetitionActive ? 'Competition Active' : 'Start Competition'}</span>
                    </button>
                  </div>
                )}

                {/* PDF Export Button */}
                <button
                  type="button"
                  onClick={handleExportPDF}
                  className="py-2.5 px-4 rounded-xl bg-[#1C1C1C] hover:bg-[#252525] border border-[#D4AF37]/50 text-xs font-mono font-bold text-[#D4AF37] flex items-center gap-2 transition-all"
                  title="Export results scorecard report as PDF"
                >
                  <FileText className="w-4 h-4 text-[#D4AF37]" />
                  <span>Export PDF Report</span>
                </button>
              </div>
            </div>

            {/* Main Classroom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Student Leaderboard Roster (7/12) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="glass-panel rounded-3xl p-6 border border-[#2D2D2D] space-y-4 shadow-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-[#2D2D2D]">
                    <h3 className="text-xs uppercase font-mono tracking-wider text-[#D4AF37] font-bold flex items-center gap-2">
                      <Trophy className="w-4 h-4" /> Live Leaderboard & Student Roster
                    </h3>
                    <span className="text-xs font-mono text-gray-400">
                      Capacity: <strong className="text-white">{roster.length} / 60</strong>
                    </span>
                  </div>

                  {/* Leaderboard Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-[#2D2D2D] text-[11px] font-mono text-gray-400 uppercase">
                          <th className="py-3 px-3">Rank</th>
                          <th className="py-3 px-3">Participant</th>
                          <th className="py-3 px-3">Role</th>
                          <th className="py-3 px-3">Score Points</th>
                          <th className="py-3 px-3">Accuracy</th>
                          <th className="py-3 px-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#2D2D2D]/60 text-xs font-mono">
                        {roster
                          .sort((a, b) => b.points - a.points)
                          .map((mem, idx) => (
                            <tr key={mem.id} className="hover:bg-[#1A1A1A]/80 transition-colors">
                              <td className="py-3 px-3 font-bold text-[#D4AF37]">#{idx + 1}</td>
                              <td className="py-3 px-3 font-bold text-white font-sans">{mem.name}</td>
                              <td className="py-3 px-3">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                                  mem.role === 'TEACHER' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'bg-gray-800 text-gray-300'
                                }`}>
                                  {mem.role}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-emerald-400 font-bold">+{mem.points} PTS</td>
                              <td className="py-3 px-3 text-gray-300">{mem.accuracy}%</td>
                              <td className="py-3 px-3 text-right">
                                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                                  {mem.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Column: Real-Time In-Room Text Chat (5/12) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="glass-panel rounded-3xl border border-[#2D2D2D] flex flex-col h-[520px] shadow-2xl overflow-hidden">
                  
                  {/* Chat Header */}
                  <div className="bg-[#181818] border-b border-[#2D2D2D] px-5 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
                      <h3 className="text-xs font-bold font-mono text-white uppercase tracking-wider">
                        Classroom Group Chat
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-gray-400">Live Room</span>
                  </div>

                  {/* Message Stream */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans bg-[#0E0E0E]">
                    {chatMessages.map((msg) => (
                      <div key={msg.id} className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className={`font-bold ${
                            msg.role === 'TEACHER' ? 'text-[#D4AF37]' : msg.role === 'SYSTEM' ? 'text-emerald-400' : 'text-gray-300'
                          }`}>
                            {msg.senderName}
                          </span>
                          <span className="text-gray-500">{msg.timestamp}</span>
                        </div>
                        <div className={`p-3 rounded-xl text-xs ${
                          msg.role === 'SYSTEM'
                            ? 'bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 font-mono'
                            : 'bg-[#181818] border border-[#2D2D2D] text-gray-200'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input Form */}
                  <form onSubmit={handleSendMessage} className="p-3 bg-[#141414] border-t border-[#2D2D2D] flex items-center gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Send message to classroom..."
                      className="flex-1 bg-[#1A1A1A] text-xs font-mono text-white p-2.5 rounded-xl border border-[#2D2D2D] outline-none focus:border-[#D4AF37] transition-all"
                    />
                    <button
                      type="submit"
                      disabled={!chatInput.trim()}
                      className="p-2.5 rounded-xl bg-[#D4AF37] text-black hover:bg-[#F5E6AB] transition-colors disabled:opacity-40"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>

                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
