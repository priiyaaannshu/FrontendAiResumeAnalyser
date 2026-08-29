import { useState, useRef, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Clock, BarChart3, UserCircle, Settings,
  Search, Bell, Upload, FileText, X, Menu,
  ChevronRight, HardDrive, FileUp
} from 'lucide-react'
import './DashboardPage.css'

/* ── Brand Icon ── */
function BrandIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="9" y1="13" x2="15" y2="13" />
      <line x1="9" y1="17" x2="13" y2="17" />
    </svg>
  )
}

/* ── Sidebar Navigation Items ── */
const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, active: true },
  { id: 'history', label: 'History', icon: Clock, badge: '12' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'profile', label: 'Profile', icon: UserCircle },
  { id: 'settings', label: 'Settings', icon: Settings },
]

/* ── Mock Recent Uploads ── */
const recentUploads = [
  {
    id: 1,
    name: 'Software_Engineer_Resume.pdf',
    type: 'pdf',
    score: 92,
    scoreClass: 'high',
    date: 'Aug 7, 2026',
    size: '1.2 MB',
  },
  {
    id: 2,
    name: 'Product_Manager_CV.docx',
    type: 'docx',
    score: 78,
    scoreClass: 'mid',
    date: 'Aug 5, 2026',
    size: '890 KB',
  },
  {
    id: 3,
    name: 'Data_Analyst_Resume_v3.pdf',
    type: 'pdf',
    score: 64,
    scoreClass: 'low',
    date: 'Aug 2, 2026',
    size: '1.5 MB',
  },
]

/* ── Animation Variants ── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
}

const cardHover = {
  y: -4,
  transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
}

/* ── Main Dashboard ── */
export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeNav, setActiveNav] = useState('dashboard')
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadFile, setUploadFile] = useState(null)
  const fileInputRef = useRef(null)
  const progressRef = useRef(null)

  /* ── Drag & Drop handlers ── */
  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
  }, [])

  const startUpload = useCallback((file) => {
    setUploadFile(file)
    setUploading(true)
    setUploadProgress(0)

    // Simulated upload progress
    let progress = 0
    if (progressRef.current) clearInterval(progressRef.current)
    progressRef.current = setInterval(() => {
      progress += Math.random() * 12 + 3
      if (progress >= 100) {
        progress = 100
        clearInterval(progressRef.current)
        setTimeout(() => {
          setUploading(false)
          setUploadFile(null)
          setUploadProgress(0)
        }, 800)
      }
      setUploadProgress(Math.min(Math.round(progress), 100))
    }, 300)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer?.files?.[0]
    if (file) startUpload(file)
  }, [startUpload])

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files?.[0]
    if (file) startUpload(file)
  }, [startUpload])

  const cancelUpload = useCallback(() => {
    if (progressRef.current) clearInterval(progressRef.current)
    setUploading(false)
    setUploadFile(null)
    setUploadProgress(0)
  }, [])

  useEffect(() => {
    return () => {
      if (progressRef.current) clearInterval(progressRef.current)
    }
  }, [])

  return (
    <div className="dashboard">
      {/* ── Sidebar Overlay (mobile) ── */}
      <div
        className={`dash-sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* ── Sidebar ── */}
      <motion.aside
        className={`dash-sidebar ${sidebarOpen ? 'open' : ''}`}
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Brand */}
        <div className="dash-sidebar-brand">
          <div className="dash-sidebar-logo">
            <BrandIcon />
          </div>
          <span className="dash-sidebar-title">Resumix</span>
        </div>

        {/* Navigation */}
        <nav className="dash-nav">
          <span className="dash-nav-label">Menu</span>
          {navItems.map((item) => (
            <motion.div
              key={item.id}
              className={`dash-nav-item ${activeNav === item.id ? 'active' : ''}`}
              onClick={() => {
                setActiveNav(item.id)
                setSidebarOpen(false)
              }}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <item.icon />
              {item.label}
              {item.badge && <span className="dash-nav-badge">{item.badge}</span>}
            </motion.div>
          ))}
        </nav>

        {/* Storage */}
        <div className="dash-sidebar-footer">
          <div className="dash-storage-label">
            <span><HardDrive size={13} style={{ display: 'inline', verticalAlign: '-2px', marginRight: '5px', opacity: 0.6 }} />Storage</span>
            <span>2.4 GB / 5 GB</span>
          </div>
          <div className="dash-storage-bar">
            <motion.div
              className="dash-storage-fill"
              initial={{ width: '0%' }}
              animate={{ width: '48%' }}
              transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>
      </motion.aside>

      {/* ── Main ── */}
      <main className="dash-main">
        {/* Top Bar */}
        <div className="dash-topbar">
          <div className="dash-topbar-left">
            <button
              className="dash-menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
            >
              <Menu size={18} />
            </button>
            <div className="dash-search">
              <Search size={16} />
              <input type="text" placeholder="Search resumes..." />
              <span className="dash-search-kbd">⌘K</span>
            </div>
          </div>
          <div className="dash-topbar-right">
            <button className="dash-topbar-btn" aria-label="Notifications">
              <Bell size={18} />
              <span className="notif-dot" />
            </button>
            <div className="dash-avatar">P</div>
          </div>
        </div>

        {/* Content */}
        <motion.div
          className="dash-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Welcome */}
          <motion.div className="dash-welcome" variants={itemVariants}>
            <h1>
              Welcome back, <span>Priyanshu</span>
            </h1>
            <p>Ready to improve your resume?</p>
          </motion.div>

          {/* Upload Zone */}
          <motion.div
            className={`dash-upload-zone ${dragOver ? 'drag-over' : ''}`}
            variants={itemVariants}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.3 }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.doc"
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />

            <motion.div
              className="upload-icon-wrapper"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Upload size={28} />
            </motion.div>

            <div>
              <div className="upload-text-main">
                Drag & drop your resume here, or <span>browse</span>
              </div>
              <div className="upload-text-sub">
                Upload your resume and get instant AI-powered analysis
              </div>
            </div>

            <div className="upload-formats">
              <div className="upload-format-badge">
                <span className="upload-format-dot pdf" />
                PDF
              </div>
              <div className="upload-format-badge">
                <span className="upload-format-dot docx" />
                DOCX
              </div>
              <div className="upload-size-badge">
                <FileUp size={12} />
                Max 5 MB
              </div>
            </div>

            <motion.button
              className="upload-browse-btn"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={(e) => {
                e.stopPropagation()
                fileInputRef.current?.click()
              }}
            >
              Browse Files
            </motion.button>
          </motion.div>

          {/* Upload Progress */}
          <AnimatePresence>
            {uploading && uploadFile && (
              <motion.div
                className="upload-progress-card"
                initial={{ opacity: 0, y: 12, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto', marginBottom: 32 }}
                exit={{ opacity: 0, y: -12, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="upload-progress-icon">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  >
                    <FileText size={20} />
                  </motion.div>
                </div>
                <div className="upload-progress-info">
                  <div className="upload-progress-name">{uploadFile.name}</div>
                  <div className="upload-progress-meta">
                    {(uploadFile.size / 1024 / 1024).toFixed(1)} MB · Uploading...
                  </div>
                  <div className="upload-progress-bar-track">
                    <motion.div
                      className="upload-progress-bar-fill"
                      initial={{ width: '0%' }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    />
                  </div>
                </div>
                <span className="upload-progress-percent">{uploadProgress}%</span>
                <button
                  className="upload-progress-cancel"
                  onClick={cancelUpload}
                  aria-label="Cancel upload"
                >
                  <X size={16} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Recent Uploads */}
          <motion.div variants={itemVariants}>
            <div className="dash-section-header">
              <h2 className="dash-section-title">Recent Uploads</h2>
              <Link to="/history" className="dash-section-link">
                View all <ChevronRight size={14} style={{ display: 'inline', verticalAlign: '-2px' }} />
              </Link>
            </div>
          </motion.div>

          <div className="dash-recent-grid">
            {recentUploads.map((file, index) => (
              <motion.div
                key={file.id}
                className="dash-recent-card"
                variants={itemVariants}
                whileHover={cardHover}
              >
                <div className="dash-recent-top">
                  <div className={`dash-recent-file-icon ${file.type}`}>
                    <FileText size={18} />
                  </div>
                  <span className={`dash-recent-score ${file.scoreClass}`}>
                    {file.score}/100
                  </span>
                </div>
                <div className="dash-recent-name">{file.name}</div>
                <div className="dash-recent-meta">
                  <span>{file.date}</span>
                  <span className="dash-recent-meta-dot" />
                  <span>{file.size}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  )
}
