const stats = [
  { label: "Events Organised", value: "25" },
  { label: "Startups Participated", value: "150+" },
  { label: "Funds Raised", value: "$25M+" },
];

export default function AboutStats() {
  return (
    <section className="py-16 px-6 sm:px-8 lg:px-16 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Body paragraph */}
        <p className="text-center text-base md:text-lg font-semibold text-gray-800 leading-relaxed mb-16">
          The Africa-Diaspora Startups Investment Forum (AD-SIF) is envisioned
          as a premier investment platform and convening space that bridges
          African startups with diaspora investors, strategic partners, ecosystem
          players, and institutional capital. It aims to mobilize funding,
          mentorship, and market access for high-growth startups across Africa by
          leveraging diaspora expertise, capital flows, and international
          connectivity.
          <br />
          <br />
          The Forum builds on proven investment marketplace approaches while
          filling a strategic gap: unlocking diaspora capital and tapping the
          diaspora community&rsquo;s unique position as both global investors and
          catalysts for innovation and entrepreneurship.
        </p>

        {/* Key Achievements */}
        <div className="flex flex-col items-center">
          <div className="bg-gray-100 rounded-full px-8 py-2 mb-10 shadow-inner">
            <span className="text-sm font-bold text-gray-700 tracking-wide">
              Key Achievements
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 w-full text-center">
            {stats.map(({ label, value }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  {label}
                </p>
                <p className="text-5xl font-extrabold text-[var(--color-primary)]">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}