const TravelHero = () => (
  <svg
    viewBox="0 0 500 400"
    className="w-full h-auto drop-shadow-2xl"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FEF3C7" stopOpacity="1" />
        <stop offset="100%" stopColor="#FBBF24" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="skyFade" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>
    </defs>

    <g className="animate-sun" style={{ transformOrigin: "400px 115px" }}>
      <circle cx="400" cy="115" r="78" fill="url(#sunGlow)" />
      <circle cx="400" cy="115" r="32" fill="#FEF9C3" />
    </g>

    <g opacity="0.55">
      <ellipse cx="115" cy="100" rx="32" ry="9" fill="white" />
      <ellipse cx="95" cy="96" rx="18" ry="7" fill="white" />
      <ellipse cx="135" cy="96" rx="14" ry="6" fill="white" />
    </g>
    <g opacity="0.4">
      <ellipse cx="270" cy="55" rx="22" ry="6" fill="white" />
      <ellipse cx="290" cy="52" rx="14" ry="5" fill="white" />
    </g>

    <g transform="translate(70, 140) rotate(-12)" opacity="0.85">
      <path d="M 0 0 L 32 6 L 14 12 L 8 22 Z" fill="white" />
      <path d="M 14 12 L 32 6 L 22 16 Z" fill="white" fillOpacity="0.55" />
      <path d="M 8 22 L 14 12 L 18 18 Z" fill="white" fillOpacity="0.7" />
    </g>

    <path
      d="M 0 270 L 95 175 L 175 245 L 255 155 L 335 225 L 415 165 L 500 235 L 500 400 L 0 400 Z"
      fill="white"
      fillOpacity="0.18"
    />

    <path
      d="M 0 315 L 75 235 L 155 295 L 235 215 L 335 285 L 415 235 L 500 275 L 500 400 L 0 400 Z"
      fill="white"
      fillOpacity="0.3"
    />

    <path
      d="M 0 355 L 55 285 L 135 335 L 215 275 L 315 345 L 395 295 L 500 335 L 500 400 L 0 400 Z"
      fill="white"
      fillOpacity="0.48"
    />

    <rect x="0" y="0" width="500" height="280" fill="url(#skyFade)" />

    <path
      d="M 110 400 Q 200 380 250 360 T 400 335"
      stroke="white"
      strokeWidth="2"
      strokeDasharray="5 6"
      strokeOpacity="0.5"
      fill="none"
    />

    <g transform="translate(360, 200)" opacity="0.9">
      <path
        d="M 0 0 C -7 0 -12 5 -12 12 C -12 20 0 30 0 30 C 0 30 12 20 12 12 C 12 5 7 0 0 0 Z"
        fill="white"
      />
      <circle cx="0" cy="11" r="4" fill="#EC4899" />
    </g>

    <g transform="translate(195, 235)">
      <path d="M -14 25 L -11 70 L 11 70 L 14 25 Z" fill="#1E1B4B" />
      <circle cx="0" cy="13" r="12" fill="#FED7AA" />
      <path
        d="M -12 11 Q -12 0 0 0 Q 12 0 12 11 L 12 8 Q 6 5 0 5 Q -6 5 -12 8 Z"
        fill="#1E1B4B"
      />
      <rect x="-22" y="28" width="10" height="22" rx="3" fill="#F97316" />
      <circle cx="-17" cy="38" r="1.8" fill="#FBBF24" />
      <rect x="-7" y="67" width="5" height="18" rx="1" fill="#312E81" />
      <rect x="2" y="67" width="5" height="18" rx="1" fill="#312E81" />
      <line
        x1="14"
        y1="35"
        x2="18"
        y2="88"
        stroke="#92400E"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </g>

    <g transform="translate(290, 240)">
      <path d="M -14 25 L -11 68 L 11 68 L 14 25 Z" fill="#7C3AED" />
      <circle cx="0" cy="13" r="12" fill="#FECACA" />
      <path
        d="M -12 11 Q -12 -2 0 -2 Q 12 -2 12 11 L 12 17 Q 8 20 0 20 Q -8 20 -12 17 Z"
        fill="#7C2D12"
      />
      <rect x="12" y="26" width="10" height="22" rx="3" fill="#10B981" />
      <circle cx="17" cy="36" r="1.8" fill="#FBBF24" />
      <rect x="-7" y="65" width="5" height="18" rx="1" fill="#312E81" />
      <rect x="2" y="65" width="5" height="18" rx="1" fill="#312E81" />
    </g>
  </svg>
);

export default TravelHero;
