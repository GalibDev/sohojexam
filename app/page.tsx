"use client";

import { useMemo, useState } from "react";

const departments = [
  { name: "Computer Science", short: "CSE", icon: "</>", meta: "8 semesters · 2,540 questions", active: true },
  { name: "Electrical & Electronic", short: "EEE", icon: "⌁", meta: "Coming soon" },
  { name: "Textile Engineering", short: "TE", icon: "⌗", meta: "Coming soon" },
  { name: "Civil Engineering", short: "CE", icon: "△", meta: "Coming soon" },
  { name: "Architecture", short: "ARCH", icon: "⌂", meta: "Coming soon" },
];

const subjects = [
  { name: "Data Structures", code: "CSE 2103", sem: "2nd Year · 1st Semester", questions: 486, years: 6, progress: 72, tone: "mint", icon: "DS" },
  { name: "Object-Oriented Programming", code: "CSE 2101", sem: "2nd Year · 1st Semester", questions: 328, years: 5, progress: 48, tone: "violet", icon: "OP" },
  { name: "Database Management", code: "CSE 3101", sem: "3rd Year · 1st Semester", questions: 274, years: 6, progress: 65, tone: "blue", icon: "DB" },
  { name: "Operating Systems", code: "CSE 3201", sem: "3rd Year · 2nd Semester", questions: 219, years: 4, progress: 31, tone: "orange", icon: "OS" },
];

const repeated = [
  { q: "Define Stack. Explain its basic operations with algorithms.", topic: "Stack Basics", repeat: 7, years: "2020, 2021, 2022, 2023, 2025", score: 96, level: "Very Important" },
  { q: "What is a circular queue? Mention its advantages.", topic: "Queue", repeat: 6, years: "2020, 2022, 2023, 2024", score: 91, level: "Very Important" },
  { q: "Explain binary search with time complexity.", topic: "Searching", repeat: 5, years: "2021, 2022, 2024, 2025", score: 84, level: "Important" },
];

const nav = ["Home", "Departments", "Questions", "Exam Mode", "Mock Test", "Study Planner"];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState<number[]>([1]);
  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return [...subjects.map(s => ({ title: s.name, sub: `${s.code} · ${s.questions} questions` })), ...repeated.map(r => ({ title: r.q, sub: `${r.topic} · Repeated ${r.repeat} times` }))].filter(x => x.title.toLowerCase().includes(q) || x.sub.toLowerCase().includes(q)).slice(0, 5);
  }, [query]);

  const toggleSaved = (index: number) => setSaved(s => s.includes(index) ? s.filter(i => i !== index) : [...s, index]);

  return (
    <main>
      <header className="topbar">
        <a href="#home" className="brand" aria-label="Sohoj Exam home"><span className="brand-mark">S</span><span>Sohoj<span>Exam</span></span></a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {nav.map((item, i) => <a key={item} className={i === 0 ? "active" : ""} href={`#${item.toLowerCase().replace(" ", "-")}`}>{item}</a>)}
        </nav>
        <div className="nav-actions"><button className="icon-btn" aria-label="Notifications">♧<i /></button><button className="login-btn">Log in</button><button className="join-btn">Join for free <span>→</span></button></div>
        <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle menu"><span /><span /><span /></button>
        {menuOpen && <nav className="mobile-menu">{nav.map(item => <a onClick={() => setMenuOpen(false)} key={item} href={`#${item.toLowerCase().replace(" ", "-")}`}>{item}<span>›</span></a>)}<button>Join for free</button></nav>}
      </header>

      <section className="hero" id="home">
        <div className="hero-glow one" /><div className="hero-glow two" /><div className="dot-grid" />
        <div className="hero-copy">
          <div className="eyebrow"><span>✦</span> BUILT FOR BANGLADESH&apos;S ENGINEERING STUDENTS</div>
          <h1>Prepare smarter.<br /><em>Score better.</em></h1>
          <p>Previous questions, repeated topics, smart analysis and focused exam preparation—all in one beautifully simple place.</p>
          <div className="search-wrap">
            <span className="search-icon">⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search a subject, question or topic..." aria-label="Search" />
            <kbd>⌘ K</kbd><button>Search</button>
            {query && <div className="search-results">{results.length ? results.map((r, i) => <a href="#questions" key={i}><b>{r.title}</b><span>{r.sub}</span></a>) : <div className="no-result">No matching result found</div>}</div>}
          </div>
          <div className="quick-links"><span>Popular:</span><a href="#subjects">Data Structures</a><a href="#subjects">OOP</a><a href="#subjects">Database</a></div>
          <div className="hero-buttons"><a href="#subjects" className="primary-btn">Explore questions <span>→</span></a><a href="#exam-mode" className="secondary-btn"><span>▶</span> Start exam mode</a></div>
        </div>
        <div className="hero-visual" aria-label="Preparation dashboard preview">
          <div className="float-pill pill-one"><span>↗</span><div><b>7× repeated</b><small>Stack · Very important</small></div></div>
          <div className="dash-card">
            <div className="dash-head"><div><small>GOOD MORNING, RIFAT</small><h3>Your preparation</h3></div><div className="avatar">RA</div></div>
            <div className="exam-banner"><div><span className="live-dot" /> NEXT EXAM</div><b>Data Structures Final</b><small>20 August 2026</small><strong>18 <i>days left</i></strong></div>
            <div className="dash-grid">
              <div className="progress-ring" style={{"--progress": "198deg"} as React.CSSProperties}><div><b>55%</b><span>Prepared</span></div></div>
              <div className="mini-stat"><span>Completed</span><b>22 <small>questions</small></b><div><i style={{width:"55%"}} /></div></div>
              <div className="mini-stat"><span>To revise</span><b>18 <small>questions</small></b><div className="orange"><i style={{width:"42%"}} /></div></div>
            </div>
            <div className="dash-title"><b>Today&apos;s focus</b><span>View plan →</span></div>
            {[['Stack & Queue','8 questions','72%'],['Tree Traversal','5 questions','40%']].map(x => <div className="focus-row" key={x[0]}><span className="check">✓</span><div><b>{x[0]}</b><small>{x[1]}</small></div><strong>{x[2]}</strong></div>)}
          </div>
          <div className="float-pill pill-two"><div className="spark">✦</div><div><small>SMART RECOMMENDATION</small><b>Study Tree Traversal next</b></div></div>
        </div>
        <div className="trust-row"><div className="faces"><span>AR</span><span>SN</span><span>TM</span><span>+2k</span></div><div><b>Trusted by 2,000+ students</b><span>★★★★★ <i>4.9 average rating</i></span></div></div>
      </section>

      <section className="stats-strip">
        {[['2,500+','Verified questions'],['30+','Engineering subjects'],['6','Partner colleges'],['12k+','Study sessions']].map((s,i) => <div key={s[1]}><span className={`stat-icon c${i}`}>{['⌘','▤','⌂','↗'][i]}</span><p><b>{s[0]}</b><small>{s[1]}</small></p></div>)}
      </section>

      <section className="section departments" id="departments">
        <div className="section-heading"><div><span className="kicker">START EXPLORING</span><h2>Choose your department</h2><p>Find questions, subjects and resources organized for your academic journey.</p></div><a href="#departments">View all departments <span>→</span></a></div>
        <div className="department-grid">{departments.map((d, i) => <article className={`department-card ${d.active ? "active" : "disabled"}`} key={d.short}>
          <div className="dept-icon">{d.icon}</div><div className="dept-status">{d.active ? <><i /> ACTIVE</> : "COMING SOON"}</div><h3>{d.short}</h3><b>{d.name}</b><p>{d.meta}</p>{d.active && <a href="#subjects">Explore department <span>→</span></a>}{i > 0 && <div className="soon-line" />}
        </article>)}</div>
      </section>

      <section className="section subjects" id="subjects">
        <div className="section-heading"><div><span className="kicker">POPULAR RIGHT NOW</span><h2>Pick up where others are learning</h2></div><div className="segmented"><button className="selected">All subjects</button><button>My semester</button></div></div>
        <div className="subject-grid">{subjects.map(s => <article className="subject-card" key={s.code}><div className="sub-top"><span className={`subject-icon ${s.tone}`}>{s.icon}</span><button aria-label={`More options for ${s.name}`}>•••</button></div><span className="code">{s.code}</span><h3>{s.name}</h3><p>{s.sem}</p><div className="subject-meta"><span><b>{s.questions}</b> questions</span><i /><span><b>{s.years}</b> years</span></div><div className="subject-progress"><div><span>Your progress</span><b>{s.progress}%</b></div><div><i style={{width:`${s.progress}%`}} /></div></div><a href="#questions">View questions <span>→</span></a></article>)}</div>
      </section>

      <section className="section repeated-section" id="questions">
        <div className="section-heading"><div><span className="kicker coral">HIGH-YIELD QUESTIONS</span><h2>Most repeated this week</h2><p>Smart-ranked from years of papers across multiple colleges.</p></div><a href="#questions">See all important questions <span>→</span></a></div>
        <div className="question-layout"><div className="question-list">{repeated.map((r, i) => <article className="question-card" key={r.q}><div className="rank">0{i+1}</div><div className="question-main"><div className="badges"><span className={i < 2 ? "critical" : "important"}>● {r.level}</span><span>{r.topic}</span></div><h3>{r.q}</h3><div className="question-data"><span><b>{r.repeat}×</b> repeated</span><span>Years: {r.years}</span><span>Score <b>{r.score}/100</b></span></div></div><div className="question-actions"><button onClick={() => toggleSaved(i)} className={saved.includes(i) ? "saved" : ""} aria-label="Bookmark">{saved.includes(i) ? "♥" : "♡"}</button><a href="#exam-mode">Study now →</a></div></article>)}</div>
          <aside className="insight-card"><span className="insight-icon">✦</span><small>SMART INSIGHT</small><h3>Focus on what matters most.</h3><p>Our importance score looks at repeat count, recent years, college coverage and final exam appearances.</p><div className="score-bars">{[['Repeat frequency',50],['Recent appearance',20],['College coverage',20],['Expert priority',10]].map(x => <div key={x[0]}><span>{x[0]} <b>+{x[1]}</b></span><div><i style={{width:`${x[1]*2}%`}} /></div></div>)}</div><a href="#exam-mode">How scoring works <span>→</span></a></aside></div>
      </section>

      <section className="exam-cta" id="exam-mode"><div className="cta-orb orb1"/><div className="cta-orb orb2"/><div className="cta-copy"><span>✦ EXAM MODE</span><h2>Don&apos;t know what<br />to study first?</h2><p>Tell us your subject and exam date. We&apos;ll build a focused plan from the questions most likely to matter.</p><a href="#home">Build my preparation plan <b>→</b></a><small>✓ Free to start &nbsp; · &nbsp; ✓ Takes less than 2 minutes</small></div><div className="plan-card"><div className="plan-head"><div><small>YOUR SMART PLAN</small><b>Data Structures</b></div><span>18 days</span></div><div className="timeline">{[['Today','Stack & Queue','8 questions · 45 min','done'],['Tomorrow','Linked List','6 questions · 35 min','active'],['Day 3','Tree & Traversal','9 questions · 55 min',''],['Day 4','Sorting Algorithms','7 questions · 40 min','']].map((t,i) => <div className={t[3]} key={t[1]}><span className="timeline-dot">{i===0?'✓':i+1}</span><small>{t[0]}</small><p><b>{t[1]}</b><em>{t[2]}</em></p>{i===1&&<button>Start →</button>}</div>)}</div><div className="plan-foot"><span>Next milestone</span><b>Quick mock test · Day 5</b><i>›</i></div></div></section>

      <section className="steps section"><span className="kicker">SIMPLE BY DESIGN</span><h2>From question paper to exam-ready</h2><div className="steps-grid">{[['01','Choose your path','Pick department, semester and subject.'],['02','Discover the pattern','See repeats, importance and real sources.'],['03','Prepare with focus','Learn, bookmark and track your progress.'],['04','Test yourself','Take a mock and improve weak topics.']].map((x,i)=><article key={x[0]}><div className={`step-icon s${i}`}>{['⌕','↗','✓','▶'][i]}</div><span>{x[0]}</span><h3>{x[1]}</h3><p>{x[2]}</p>{i<3&&<i className="connector">→</i>}</article>)}</div></section>

      <footer><div className="footer-main"><div className="footer-brand"><a href="#home" className="brand"><span className="brand-mark">S</span><span>Sohoj<span>Exam</span></span></a><p>Smart exam preparation for every engineering student in Bangladesh.</p><div className="socials"><a href="#">f</a><a href="#">in</a><a href="#">▶</a></div></div>{[['Platform','Previous Questions','Exam Mode','Mock Test','Study Planner'],['Explore','Departments','Subjects','Colleges','Contributors'],['Company','About us','Contribute','Contact','Privacy & Terms']].map(col=><div className="footer-col" key={col[0]}><b>{col[0]}</b>{col.slice(1).map(x=><a href="#" key={x}>{x}</a>)}</div>)}</div><div className="footer-bottom"><span>© 2026 SohojExam. Made with care for students.</span><span><i /> All systems operational</span></div></footer>

      <nav className="bottom-nav" aria-label="Mobile navigation">{[['⌂','Home'],['⌕','Questions'],['✦','Exam Mode'],['♡','Saved'],['○','Profile']].map((x,i)=><a className={i===0?'active':''} href={i===2?'#exam-mode':'#home'} key={x[1]}><span>{x[0]}</span>{x[1]}</a>)}</nav>
    </main>
  );
}
