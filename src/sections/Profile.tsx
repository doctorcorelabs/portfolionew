/**
 * Profile: the "team" equivalent for a one-person lab, Onlines
 * section 6 equivalent. Title at team-section scale (64-96px),
 * bio from the old site, anchor numbers as plain text rows,
 * never as KPI cards. Blue #0859D4 only for the email link.
 */

const DISPLAY =
  "Inter, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const MONO =
  "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

const ANCHORS: Array<{ label: string; value: string }> = [
  { label: "GPA, Bachelor of Medicine, UII", value: "3.91 / 4.0" },
  { label: "Total awards recorded on the old site", value: "29" },
  { label: "Gold medals", value: "6" },
  { label: "International items", value: "12" },
  { label: "Old-site publications", value: "4" },
  { label: "Certifications", value: "20+" },
  { label: "Key roles", value: "8" },
];

export default function Profile() {
  return (
    <section
      id="profile"
      aria-labelledby="profile-heading"
      style={{
        background: "#FAFAFA",
        color: "#010101",
        fontFamily: DISPLAY,
        padding: "130px 24px",
      }}
    >
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>
        <p
          style={{
            fontFamily: MONO,
            fontSize: 12,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#666666",
            margin: "0 0 24px",
          }}
        >
          Profile
        </p>
        <h2
          id="profile-heading"
          style={{
            fontSize: "clamp(48px, 8vw, 96px)",
            lineHeight: 1.02,
            letterSpacing: "-0.02em",
            fontWeight: 700,
            margin: "0 0 48px",
            maxWidth: 900,
          }}
        >
          A researcher who builds.
        </h2>
        <div style={{ maxWidth: 680 }}>
          <p
            style={{ fontSize: 18, lineHeight: 1.65, margin: "0 0 24px" }}
          >
            I am Daivan Febri Juan Setiya, a medical student and researcher
            in Indonesia. Guided by the principle{" "}
            <em>Ad maiora natus sum</em> (born for greater things), I view
            medicine as a pathway to transformative service.
          </p>
          <p
            style={{ fontSize: 18, lineHeight: 1.65, margin: "0 0 24px" }}
          >
            My goal is to move beyond immediate solutions and create
            sustainable health systems for Indonesia, through research
            done carefully, tools that are actually useful, and work
            finished properly.
          </p>
          <p
            style={{ fontSize: 18, lineHeight: 1.65, margin: "0 0 24px" }}
          >
            I founded DaivanLabs in June 2025 to apply coding skills
            (Code) to healthcare-related tools (Cure) and to build
            professional connections (Connect).
          </p>
          <p
            style={{
              fontFamily: MONO,
              fontSize: 13,
              lineHeight: 1.7,
              color: "#3C3C38",
              margin: "0 0 24px",
            }}
          >
            Current status: clinical clerk (koas), surgery rotation from
            5 October 2026. Based in Indonesia.{" "}
            <a
              href="mailto:daivanfebrijuansetiya@gmail.com"
              style={{ color: "#0859D4" }}
            >
              daivanfebrijuansetiya@gmail.com
            </a>
          </p>
        </div>
        <dl style={{ margin: "64px 0 0", padding: 0 }}>
          {ANCHORS.map((row) => (
            <div
              key={row.label}
              style={{
                borderTop: "1px solid #E0E0E0",
                padding: "16px 0",
                display: "flex",
                flexWrap: "wrap",
                gap: "8px 48px",
                alignItems: "baseline",
              }}
            >
              <dt
                style={{
                  fontFamily: MONO,
                  fontSize: 13,
                  color: "#666666",
                  minWidth: 320,
                }}
              >
                {row.label}
              </dt>
              <dd
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                  margin: 0,
                }}
              >
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
