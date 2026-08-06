function HeroMap() {
  return (
    <div className="hero-map" aria-hidden="true">
      <svg className="hero-map__svg" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="mapWash" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0f2a26" />
            <stop offset="45%" stopColor="#163a34" />
            <stop offset="100%" stopColor="#1c2e4a" />
          </linearGradient>
          <radialGradient id="glowA" cx="32%" cy="42%" r="28%">
            <stop offset="0%" stopColor="#3ddc97" stopOpacity="0.16" />
            <stop offset="70%" stopColor="#3ddc97" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#3ddc97" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="glowB" cx="68%" cy="58%" r="24%">
            <stop offset="0%" stopColor="#ff6b3d" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#ff6b3d" stopOpacity="0" />
          </radialGradient>
          <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M48 0H0V48" fill="none" stroke="rgba(214,232,226,0.07)" strokeWidth="1" />
          </pattern>
        </defs>

        <rect width="1440" height="900" fill="url(#mapWash)" />
        <rect width="1440" height="900" fill="url(#grid)" />
        <rect width="1440" height="900" fill="url(#glowA)" />
        <rect width="1440" height="900" fill="url(#glowB)" />

        {/* Street network */}
        <g stroke="rgba(214,232,226,0.18)" strokeWidth="2" fill="none">
          <path d="M0 220 C220 180 380 260 560 240 S880 160 1100 210 S1320 280 1440 250" />
          <path d="M0 480 C180 520 360 440 540 470 S900 560 1120 500 S1300 430 1440 470" />
          <path d="M0 700 C240 660 420 740 640 710 S980 640 1200 690 S1360 760 1440 730" />
          <path d="M180 0 C200 180 140 320 210 480 S300 720 250 900" />
          <path d="M520 0 C480 200 560 360 500 540 S440 780 560 900" />
          <path d="M860 0 C900 160 820 340 880 520 S940 760 820 900" />
          <path d="M1180 0 C1140 220 1220 400 1160 580 S1100 780 1240 900" />
        </g>

        {/* Geofence zones */}
        <g className="hero-map__zone hero-map__zone--a" opacity="0.45">
          <circle cx="460" cy="380" r="150" fill="rgba(61,220,151,0.04)" stroke="#3ddc97" strokeWidth="1.5" />
          <circle cx="460" cy="380" r="96" fill="none" stroke="#3ddc97" strokeWidth="1.25" strokeDasharray="6 8" opacity="0.55" />
          <circle cx="460" cy="380" r="10" fill="#3ddc97" opacity="0.7" />
        </g>
        <g className="hero-map__zone hero-map__zone--b" opacity="0.4">
          <circle cx="980" cy="520" r="120" fill="rgba(255,107,61,0.035)" stroke="#ff6b3d" strokeWidth="1.5" />
          <circle cx="980" cy="520" r="72" fill="none" stroke="#ff6b3d" strokeWidth="1.25" strokeDasharray="5 7" opacity="0.5" />
          <circle cx="980" cy="520" r="8" fill="#ff6b3d" opacity="0.65" />
        </g>
      </svg>
      <div className="hero-map__grain" />
    </div>
  )
}

export default HeroMap
