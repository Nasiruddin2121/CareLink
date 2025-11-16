const milestones = [
  {
    title: "One message, full medical reach",
    description:
      "Patients share their concern once—our system instantly circulates it to the entire verified medical network so the right doctor can take charge without delays.",
  },
  {
    title: "Live clinical collaboration",
    description:
      "Doctors, patients, and pharmacies stay aligned through secure real-time chat. No separate portals, no switching apps—just one continuous clinical thread.",
  },
  {
    title: "Smart prescription routing",
    description:
      "When a doctor issues a prescription, partnered pharmacies are notified instantly, ensuring faster availability and smooth medication fulfillment.",
  },
];

export default function AboutSection() {
  const gradientCards = [
    "from-blue-500/10 via-cyan-500/10 to-purple-500/10",
    "from-purple-500/10 via-pink-500/10 to-indigo-500/10",
    "from-indigo-500/10 via-blue-500/10 to-cyan-500/10",
  ];

  const borderGradients = [
    "from-blue-500 to-cyan-500",
    "from-purple-500 to-pink-500",
    "from-indigo-500 to-blue-500",
  ];

  return (
    <section
      id="about"
      className="relative border-t border-gray-200/50 bg-gradient-to-b from-white to-gray-50/40 py-20 dark:border-gray-800/50 dark:from-gray-900 dark:to-gray-800/20"
    >
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-purple-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300 border border-blue-500/20 dark:border-blue-500/30">
            How QuickMed Works
          </span>

          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
            A unified flow for modern patient care.
          </h2>

          <p className="mt-4 text-base text-gray-600 dark:text-gray-300 md:text-lg leading-relaxed">
            Instead of scattered apps and complicated dashboards, QuickMed
            organizes every action—broadcasting, doctor responses, clinical
            discussion, and prescription delivery—into one continuous, easy-to-follow
            conversation.
          </p>
        </div>

        {/* MILESTONES */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {milestones.map((item, index) => (
            <div
              key={item.title}
              className={`relative rounded-2xl bg-gradient-to-br ${gradientCards[index]} p-6 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-sm`}
            >
              {/* TOP BORDER HIGHLIGHT */}
              <div
                className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${borderGradients[index]} rounded-t-2xl`}
              />

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {item.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
