import { FormEvent, useEffect, useRef, useState } from "react";

const API = import.meta.env.VITE_API_URL ?? "";

type Profile = {
  name: string; initials: string; role: string; headline: string; intro: string;
  email: string; linkedin: string; github: string; location: string;
  stats: { value: string; label: string }[];
  services: { title: string; text: string; points: string[] }[];
  experience: { title: string; where: string; when: string; points: string[] }[];
  stack: { group: string; items: string[] }[];
};
type Project = { title: string; kind: string; tags: string[]; problem: string; built: string };

const Tags = ({ items }: { items: string[] }) => (
  <div className="tag">{items.map((t) => <span key={t}>{t}</span>)}</div>
);

function Loader({ ready }: { ready: boolean }) {
  const [pct, setPct] = useState(0);
  const [gone, setGone] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setPct((v) => Math.min(100, v + 4)), 45);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    if (ready && pct >= 100) { const t = setTimeout(() => setGone(true), 500); return () => clearTimeout(t); }
  }, [ready, pct]);
  if (gone) return null;
  return (
    <div className={`loader${ready && pct >= 100 ? " out" : ""}`} aria-hidden="true">
      <div><b>FM.</b><span>Initialising {pct}%</span><i style={{ width: `${pct}%` }} /></div>
    </div>
  );
}

function Count({ value }: { value: string }) {
  const m = value.match(/^(\d+)(.*)$/);
  const ref = useRef<HTMLElement>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!m || !ref.current) return;
    const target = Number(m[1]);
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const k = Math.min(1, (now - start) / 1200);
        setN(Math.round(target * (1 - Math.pow(1 - k, 3))));
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return m ? <b ref={ref}>{n}{m[2]}</b> : <b>{value}</b>;
}

function Marquee({ items }: { items: string[] }) {
  const row = items.map((t) => <span key={t}>{t}<em>✦</em></span>);
  return <div className="marquee" aria-hidden="true"><div className="track">{row}{row}</div></div>;
}

function Contact({ email, linkedin, github }: { email: string; linkedin: string; github: string }) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const form = ev.currentTarget;
    setState("sending");
    try {
      const res = await fetch(`${API}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      form.reset();
      setState("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setState("error");
    }
  }

  return (
    <section id="contact" className="contact"><div className="wrap">
      <h2>Have a project in mind? Let's talk.</h2>
      <p>Tell me what you're building or which process is eating your team's week.</p>
      <form onSubmit={submit}>
        <input name="name" placeholder="Your name" required minLength={2} />
        <input name="email" type="email" placeholder="Your email" required />
        <textarea name="message" placeholder="What are you building?" rows={5} required minLength={10} />
        <input name="website" className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        <button className="btn primary" disabled={state === "sending"}>{state === "sending" ? "Sending…" : "Send message"}</button>
        <p role="status" className={state === "error" ? "err" : "ok"}>
          {state === "done" && "Message sent. I'll reply by email soon."}
          {state === "error" && error}
        </p>
      </form>
      <div className="links"><a className="btn" href={`mailto:${email}`}>{email}</a><a className="btn" href={linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a><a className="btn" href={github} target="_blank" rel="noopener noreferrer">GitHub</a></div>
    </div></section>
  );
}

export default function App() {
  const [p, setP] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [failed, setFailed] = useState(false);
  const [photoOk, setPhotoOk] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/profile`).then((r) => r.json()),
      fetch(`${API}/api/projects`).then((r) => r.json()),
    ]).then(([pr, pj]) => { setP(pr); setProjects(pj); }).catch(() => setFailed(true));
  }, []);

  useEffect(() => {
    if (!p) return;
    const els = document.querySelectorAll<HTMLElement>(".sec-head,.card,.proj article,.job,.stats div");
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }), { threshold: 0.12 });
    els.forEach((el, i) => { el.classList.add("reveal"); el.style.transitionDelay = `${(i % 3) * 90}ms`; io.observe(el); });
    return () => io.disconnect();
  }, [p, projects]);

  if (failed) return <p className="state">Couldn't reach the server. Please refresh in a moment.</p>;
  if (!p) return <Loader ready={false} />;

  return (<>
    <Loader ready />
    <header><div className="wrap"><nav>
      <a className="logo" href="#top">{p.initials}<span>.</span></a>
      <ul>{["services", "work", "experience", "stack"].map((s) => <li key={s}><a href={`#${s}`}>{s === "work" ? "projects" : s}</a></li>)}</ul>
      <a className="btn primary" href="#contact">Get in touch</a>
    </nav></div></header>
    <main id="top">
      <div className="wrap">
        <div className="hero">
          <div>
            <div className="status"><i />{p.role}</div>
            <h1>{p.headline}</h1>
            <p className="lead">{p.intro}</p>
            <div className="cta"><a className="btn primary" href="#work">See my projects</a><a className="btn" href="#contact">Start a project</a></div>
          </div>
          <div className="photo">
            {photoOk ? <img src="/profile.jpg" alt={`Portrait of ${p.name}`} onError={() => setPhotoOk(false)} /> : p.initials}
          </div>
        </div>
        <div className="stats">{p.stats.map((s) => <div key={s.label}><Count value={s.value} /><span>{s.label}</span></div>)}</div>
      </div>

      <Marquee items={[...p.stack[0].items, ...p.stack[2].items, ...p.stack[1].items]} />

      <section id="services"><div className="wrap">
        <div className="sec-head"><h2>Three ways I can help</h2><p>Most projects mix all three: an app for your team, integrations that move the data, and agents that handle repetitive decisions.</p></div>
        <div className="grid3">{p.services.map((s) => (
          <div className="card" key={s.title}><h3>{s.title}</h3><p>{s.text}</p><ul>{s.points.map((x) => <li key={x}>{x}</li>)}</ul></div>
        ))}</div>
      </div></section>

      <section id="work" className="flush"><div className="wrap">
        <div className="sec-head"><h2>Selected projects</h2><p>Each one started from a real workflow problem.</p></div>
        <div className="proj">{projects.map((x) => (
          <article key={x.title}>
            <div><div className="kind">{x.kind}</div><h3>{x.title}</h3><Tags items={x.tags} /></div>
            <div><p><strong>Problem.</strong> {x.problem}</p><p><strong>What I built.</strong> {x.built}</p></div>
          </article>
        ))}</div>
      </div></section>

      <section id="experience" className="flush"><div className="wrap">
        <div className="sec-head"><h2>Experience</h2></div>
        {p.experience.map((j) => (
          <div className="job" key={j.title}>
            <div><h3>{j.title}</h3><small>{j.where}<br />{j.when}</small></div>
            <ul>{j.points.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
        ))}
      </div></section>

      <section id="stack" className="flush"><div className="wrap">
        <div className="sec-head"><h2>Tools I work with</h2></div>
        <div className="tools">{p.stack.map((g) => <div className="card" key={g.group}><h3>{g.group}</h3><Tags items={g.items} /></div>)}</div>
      </div></section>

      <Contact email={p.email} linkedin={p.linkedin} github={p.github} />
    </main>
    <footer><div className="wrap"><span>{p.name}</span><span>{p.location}</span><span><a href={p.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a> · <a href={p.github} target="_blank" rel="noopener noreferrer">GitHub</a></span></div></footer>
  </>);
}
