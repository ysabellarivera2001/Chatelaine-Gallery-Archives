import { Link } from "react-router-dom";
import RecentCharacters from "./RecentCharacters";
import StatCard from "./StatCard";

function Dashboard({ characters }) {
  const groups = [1, 2, 3, 4, 5].map((group) => ({
    group,
    count: characters.filter((character) => character.group === group).length
  }));

  const statusCounts = {
    excel: characters.filter((character) => character.excelStatus).length,
    discord: characters.filter((character) => character.discordStatus).length,
    tumblr: characters.filter((character) => character.tumblrStatus).length,
    ao3: characters.filter((character) => character.ao3Status).length
  };

  const recentCharacters = [...characters].sort((a, b) => a.group - b.group || a.id - b.id).slice(0, 6);

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-white/10 bg-surface/90 p-6 shadow-glow">
        <p className="text-xs uppercase tracking-[0.22em] text-[#ffbcb5]">Dashboard</p>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-4xl">Character archive at a glance</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
              Track OC progress, browse color-coded profiles, and keep relationship threads visible while you build out
              lore.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black" to="/manage">
              Add or edit characters
            </Link>
            <Link className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm hover:bg-white/10" to="/relationships">
              View relationships
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total OCs" value={characters.length} accent="#ffbcb5" />
        <StatCard label="Excel Ready" value={statusCounts.excel} accent="#eed495" />
        <StatCard label="Discord Drafts" value={statusCounts.discord} accent="#87c3ff" />
        <StatCard label="Tumblr Posts" value={statusCounts.tumblr} accent="#79d8b7" />
        <StatCard label="AO3 Chapters" value={statusCounts.ao3} accent="#ff958f" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr,0.9fr]">
        <RecentCharacters characters={recentCharacters} />

        <div className="rounded-[28px] border border-white/10 bg-surface p-6 shadow-glow">
          <p className="text-xs uppercase tracking-[0.2em] text-[#eed495]">Group Distribution</p>
          <h2 className="mt-2 font-serif text-3xl">Where everyone sits</h2>
          <div className="mt-5 space-y-4">
            {groups.map(({ group, count }) => (
              <div key={group}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span>Group {group}</span>
                  <span className="text-muted">{count} characters</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(count / characters.length) * 100}%`, backgroundColor: "#ffbcb5" }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 grid gap-3">
            <Link className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm hover:bg-white/10" to="/tracker">
              Open progress tracker
            </Link>
            <Link className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm hover:bg-white/10" to="/list">
              Search the archive
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
