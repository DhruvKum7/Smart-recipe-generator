import React from "react";
import { Github, Linkedin, Mail, Instagram } from "lucide-react";

const socials = [
  { label: "Email", href: "mailto:dhruvkumar04553@gmail.com", Icon: Mail },
  { label: "GitHub", href: "https://github.com/DhruvKum7", Icon: Github },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/dhruv-kumar-dk/", Icon: Linkedin },
  { label: "Instagram", href: "https://www.instagram.com/dhruv_v_k?igsh=Mm1tejljbHUxbjZz", Icon: Instagram },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
      <footer className="relative w-full text-sm bg-[radial-gradient(80rem_40rem_at_50%_-10%,rgba(99,102,241,0.25),transparent),linear-gradient(to_bottom_right,#0f172a,#111827)] text-slate-200 border-t border-white/10 selection:bg-indigo-600/40 selection:text-white">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 items-start">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 shrink-0 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 ring-2 ring-white/20 shadow-lg shadow-indigo-900/40 grid place-content-center font-semibold text-white">
                DK
              </div>
              <div>
                <h2 className="text-base font-semibold tracking-wide text-white">Dhruv Kumar</h2>
                <p className="text-xs text-slate-300/90">Building neat things with React, ML, and a lot of curiosity.</p>
              </div>
            </div>

            <nav className="grid grid-cols-2 gap-3 text-sm md:justify-items-center md:grid-cols-3">
              <a className="hover:text-white transition-colors" href="/">Home</a>
              <a className="hover:text-white transition-colors" href="/projects">Projects</a>
              <a className="hover:text-white transition-colors" href="/resume">Resume</a>

              <a className="hover:text-white transition-colors" href="/contact">Contact</a>
              <a className="hover:text-white transition-colors" href="/about">About</a>
            </nav>

            <div className="flex flex-col items-start md:items-end gap-4">
              <div className="flex items-center gap-3">
                {socials.map(({ label, href, Icon }) => (
                    <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        title={label}
                        className="group relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 backdrop-blur hover:border-white/20 hover:bg-white/10 transition-transform duration-200 ease-out active:scale-95"
                    >
                      <Icon size={18} className="text-slate-200 group-hover:text-white" />
                    </a>
                ))}
              </div>
              <a
                  href="mailto:dhruvkumar04553@gmail.com?subject=Let’s%20collaborate"
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4 py-2.5 font-medium text-white shadow-lg shadow-indigo-900/30 transition-transform active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                Let’s collaborate
              </a>
            </div>
          </div>

          <div className="relative my-8 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          <div className="flex flex-col-reverse items-center justify-between gap-4 md:flex-row">
            <p className="text-xs text-slate-400">© {year} Dhruv Kumar • Built with React & TailwindCSS</p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-wider text-slate-300">Responsive</span>
              <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-wider text-slate-300">Accessible</span>
              <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-wider text-slate-300">Minimal UI</span>
            </div>
          </div>
        </div>
      </footer>
  );
};

export default Footer;
