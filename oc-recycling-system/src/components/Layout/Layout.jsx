import Sidebar from "./Sidebar";

function Layout({ characters, children }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(255,188,181,0.08),transparent_32%),radial-gradient(circle_at_top_right,rgba(241,206,102,0.08),transparent_28%),linear-gradient(180deg,#171717_0%,#1a1a1a_100%)] text-text">
      <div className="mx-auto grid min-h-screen max-w-[1600px] lg:grid-cols-[280px_minmax(0,1fr)]">
        <Sidebar totalCharacters={characters.length} />
        <main className="p-5 md:p-7">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
