/**
 * HealthScoreGauge — SVG arc gauge showing 0-100 score
 * Colour zones: 0-39 red, 40-59 amber, 60-79 blue, 80-100 green
 */
export default function HealthScoreGauge({ score = 0, grade = "B", size = 180 }) {
  const r       = 70;
  const cx      = 90;
  const cy      = 95;
  const startAngle = -210;
  const totalArc   = 240; // degrees

  function polarToXY(angleDeg, radius) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  }

  function describeArc(startDeg, endDeg, radius) {
    const s   = polarToXY(startDeg, radius);
    const e   = polarToXY(endDeg, radius);
    const lg  = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${radius} ${radius} 0 ${lg} 1 ${e.x} ${e.y}`;
  }

  const clampedScore = Math.min(100, Math.max(0, score));
  const fillAngle    = startAngle + (clampedScore / 100) * totalArc;

  const color =
    clampedScore >= 80 ? "#00D9A3" :
    clampedScore >= 60 ? "#6C63FF" :
    clampedScore >= 40 ? "#D4AF37" :
    "#C81E3A";

  const gradeColors = {
    A: "#00D9A3", B: "#6C63FF", C: "#D4AF37", D: "#C81E3A",
  };
  const gradeLabel = { A: "Excellent", B: "Good", C: "Fair", D: "Needs Work" };

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size * 0.85} viewBox="0 0 180 160">
        {/* Background track */}
        <path
          d={describeArc(startAngle, startAngle + totalArc, r)}
          fill="none"
          stroke="#2A2A2E"
          strokeWidth="14"
          strokeLinecap="round"
        />

        {/* Coloured fill arc */}
        {clampedScore > 0 && (
          <path
            d={describeArc(startAngle, fillAngle, r)}
            fill="none"
            stroke={color}
            strokeWidth="14"
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 8px ${color}88)`,
              transition: "all 0.8s ease",
            }}
          />
        )}

        {/* Zone ticks */}
        {[0, 40, 60, 80, 100].map(v => {
          const angle = startAngle + (v / 100) * totalArc;
          const inner = polarToXY(angle, r - 10);
          const outer = polarToXY(angle, r + 10);
          return (
            <line key={v}
              x1={inner.x} y1={inner.y}
              x2={outer.x} y2={outer.y}
              stroke="#2A2A2E" strokeWidth="2" />
          );
        })}

        {/* Score number */}
        <text x={cx} y={cy + 4} textAnchor="middle" dominantBaseline="middle"
          fontSize="32" fontWeight="700" fill={color} fontFamily="IBM Plex Sans, sans-serif">
          {clampedScore}
        </text>
        <text x={cx} y={cy + 24} textAnchor="middle"
          fontSize="11" fill="#9B968C" fontFamily="IBM Plex Sans, sans-serif">
          out of 100
        </text>

        {/* Grade */}
        <text x={cx} y={cy - 30} textAnchor="middle"
          fontSize="16" fontWeight="700" fill={gradeColors[grade] || color}
          fontFamily="IBM Plex Sans, sans-serif">
          Grade {grade}
        </text>

        {/* Min / Max labels */}
        <text x="18" y="148" textAnchor="middle" fontSize="9" fill="#9B968C" fontFamily="IBM Plex Sans, sans-serif">0</text>
        <text x="162" y="148" textAnchor="middle" fontSize="9" fill="#9B968C" fontFamily="IBM Plex Sans, sans-serif">100</text>
      </svg>

      <p className="text-sm font-semibold mt-1" style={{ color: gradeColors[grade] || color }}>
        {gradeLabel[grade] || "Calculating..."}
      </p>
    </div>
  );
}
