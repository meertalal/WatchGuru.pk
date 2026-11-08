/**
 * Decorative footer skyline — a wavy upper edge over a watchmakers' city
 * silhouette: towers, trees and a central clock tower, all lit by a faint
 * champagne horizon glow. The silhouette sits on the page colour and is cut by
 * the footer's curved edge, so the two surfaces meet without a seam.
 */
export function FooterSkyline() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative -mb-px select-none bg-obsidian"
    >
      <svg
        viewBox="0 0 1440 220"
        preserveAspectRatio="xMidYMax slice"
        className="block h-[150px] w-full sm:h-[185px] lg:h-[225px]"
      >
        <defs>
          <linearGradient id="footerHorizon" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="var(--color-gold)" stopOpacity="0.16" />
            <stop offset="45%" stopColor="var(--color-gold)" stopOpacity="0.055" />
            <stop offset="100%" stopColor="var(--color-gold)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Champagne haze behind the skyline */}
        <rect width="1440" height="220" fill="url(#footerHorizon)" />

        {/* Distant skyline */}
        <g fill="var(--color-charcoal)" opacity="0.4">
          <rect x="20" y="90" width="14" height="130" />
          <rect x="44" y="66" width="20" height="154" />
          <rect x="74" y="104" width="12" height="116" />
          <rect x="96" y="58" width="18" height="162" />
          <rect x="124" y="86" width="14" height="134" />
          <rect x="150" y="74" width="22" height="146" />
          <rect x="184" y="112" width="12" height="108" />
          <rect x="206" y="60" width="18" height="160" />
          <rect x="234" y="96" width="14" height="124" />
          <rect x="262" y="72" width="20" height="148" />
          <rect x="294" y="118" width="12" height="102" />
          <rect x="318" y="82" width="16" height="138" />
          <rect x="346" y="62" width="22" height="158" />
          <rect x="380" y="100" width="12" height="120" />
          <rect x="404" y="78" width="18" height="142" />
          <rect x="434" y="108" width="14" height="112" />
          <rect x="462" y="68" width="20" height="152" />
          <rect x="494" y="90" width="12" height="130" />
          <rect x="520" y="56" width="16" height="164" />
          <rect x="548" y="84" width="22" height="136" />
          <rect x="582" y="110" width="12" height="110" />
          <rect x="606" y="74" width="18" height="146" />
          <rect x="636" y="98" width="14" height="122" />
          <rect x="664" y="64" width="20" height="156" />
          <rect x="696" y="88" width="12" height="132" />
          <rect x="720" y="52" width="16" height="168" />
          <rect x="748" y="80" width="22" height="140" />
          <rect x="784" y="106" width="12" height="114" />
          <rect x="808" y="70" width="18" height="150" />
          <rect x="838" y="92" width="14" height="128" />
          <rect x="866" y="60" width="20" height="160" />
          <rect x="900" y="116" width="12" height="104" />
          <rect x="924" y="76" width="16" height="144" />
          <rect x="954" y="54" width="22" height="166" />
          <rect x="990" y="102" width="12" height="118" />
          <rect x="1014" y="68" width="18" height="152" />
          <rect x="1044" y="94" width="14" height="126" />
          <rect x="1072" y="58" width="20" height="162" />
          <rect x="1106" y="112" width="12" height="108" />
          <rect x="1130" y="78" width="18" height="142" />
          <rect x="1160" y="64" width="22" height="156" />
          <rect x="1196" y="100" width="12" height="120" />
          <rect x="1220" y="72" width="18" height="148" />
          <rect x="1250" y="90" width="14" height="130" />
          <rect x="1278" y="56" width="20" height="164" />
          <rect x="1312" y="108" width="12" height="112" />
          <rect x="1336" y="74" width="18" height="146" />
          <rect x="1366" y="62" width="22" height="158" />
          <rect x="1402" y="96" width="14" height="124" />
          <rect x="1426" y="80" width="14" height="140" />
        </g>

        {/* Foreground buildings */}
        <g fill="var(--color-charcoal)">
          <rect x="0" y="120" width="54" height="100" />
          <rect x="58" y="98" width="26" height="122" />
          <rect x="88" y="132" width="62" height="88" />
          <rect x="156" y="108" width="34" height="112" />
          <rect x="194" y="136" width="52" height="84" />
          <rect x="250" y="112" width="28" height="108" />
          <rect x="282" y="120" width="68" height="100" />
          <rect x="354" y="92" width="38" height="128" />
          <rect x="396" y="96" width="56" height="124" />
          <rect x="456" y="78" width="30" height="142" />
          <rect x="492" y="84" width="60" height="136" />
          <rect x="556" y="70" width="34" height="150" />
          <rect x="594" y="78" width="44" height="142" />
          <rect x="642" y="96" width="30" height="124" />

          <rect x="776" y="78" width="42" height="142" />
          <rect x="822" y="72" width="34" height="148" />
          <rect x="860" y="82" width="60" height="138" />
          <rect x="924" y="76" width="30" height="144" />
          <rect x="958" y="86" width="54" height="134" />
          <rect x="1016" y="88" width="38" height="132" />
          <rect x="1058" y="94" width="68" height="126" />
          <rect x="1130" y="106" width="30" height="114" />
          <rect x="1164" y="104" width="52" height="116" />
          <rect x="1220" y="114" width="34" height="106" />
          <rect x="1258" y="114" width="60" height="106" />
          <rect x="1322" y="102" width="30" height="118" />
          <rect x="1356" y="130" width="84" height="90" />
        </g>

        {/* Trees */}
        <g fill="var(--color-charcoal)">
          <rect x="168" y="140" width="4" height="80" />
          <circle cx="170" cy="132" r="16" />
          <circle cx="157" cy="142" r="11" />
          <circle cx="183" cy="142" r="11" />

          <rect x="343" y="118" width="4" height="102" />
          <circle cx="345" cy="108" r="13" />
          <circle cx="335" cy="116" r="9" />
          <circle cx="355" cy="116" r="9" />

          <rect x="468" y="108" width="4" height="112" />
          <circle cx="470" cy="98" r="14" />
          <circle cx="459" cy="108" r="9" />
          <circle cx="481" cy="108" r="9" />

          <rect x="897" y="110" width="4" height="110" />
          <circle cx="899" cy="100" r="14" />
          <circle cx="888" cy="110" r="9" />
          <circle cx="910" cy="110" r="9" />

          <rect x="1196" y="128" width="4" height="92" />
          <circle cx="1198" cy="120" r="12" />
          <circle cx="1189" cy="128" r="8" />
          <circle cx="1207" cy="128" r="8" />

          <rect x="1328" y="152" width="4" height="68" />
          <circle cx="1330" cy="144" r="12" />
          <circle cx="1321" cy="152" r="8" />
          <circle cx="1339" cy="152" r="8" />
        </g>

        {/* Clock tower — the brand's watchmaking motif */}
        <g fill="var(--color-charcoal)">
          <rect x="678" y="18" width="84" height="202" />
          <path d="M666 22 L720 0 L774 22 Z" />
          <rect x="674" y="16" width="92" height="8" />
          <rect x="716" y="0" width="8" height="8" />
        </g>

        <g>
          <circle
            cx="720"
            cy="62"
            r="20"
            fill="var(--color-obsidian)"
            stroke="var(--color-gold)"
            strokeOpacity="0.6"
            strokeWidth="1.5"
          />
          <circle
            cx="720"
            cy="62"
            r="14.5"
            fill="none"
            stroke="var(--color-gold)"
            strokeOpacity="0.2"
            strokeWidth="1"
          />
          <line
            x1="720"
            y1="62"
            x2="720"
            y2="49"
            stroke="var(--color-gold)"
            strokeOpacity="0.85"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="720"
            y1="62"
            x2="730"
            y2="68"
            stroke="var(--color-gold)"
            strokeOpacity="0.85"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="720" cy="62" r="2" fill="var(--color-gold)" />
          <circle cx="720" cy="4" r="2.5" fill="var(--color-gold)" opacity="0.55" />
        </g>

        {/* Lit windows */}
        <g fill="var(--color-gold)" opacity="0.4">
          <rect x="24" y="132" width="5" height="6" />
          <rect x="36" y="146" width="5" height="6" />
          <rect x="66" y="110" width="5" height="6" />
          <rect x="66" y="124" width="5" height="6" />
          <rect x="74" y="110" width="5" height="6" />
          <rect x="98" y="142" width="5" height="6" />
          <rect x="110" y="150" width="5" height="6" />
          <rect x="166" y="120" width="5" height="6" />
          <rect x="176" y="134" width="5" height="6" />
          <rect x="204" y="146" width="5" height="6" />
          <rect x="214" y="148" width="5" height="6" />
          <rect x="260" y="124" width="5" height="6" />
          <rect x="270" y="136" width="5" height="6" />
          <rect x="292" y="132" width="5" height="6" />
          <rect x="302" y="144" width="5" height="6" />
          <rect x="362" y="104" width="5" height="6" />
          <rect x="372" y="118" width="5" height="6" />
          <rect x="382" y="104" width="5" height="6" />
          <rect x="404" y="108" width="5" height="6" />
          <rect x="414" y="110" width="5" height="6" />
          <rect x="404" y="126" width="5" height="6" />
          <rect x="464" y="90" width="5" height="6" />
          <rect x="474" y="100" width="5" height="6" />
          <rect x="500" y="96" width="5" height="6" />
          <rect x="512" y="102" width="5" height="6" />
          <rect x="500" y="116" width="5" height="6" />
          <rect x="564" y="82" width="5" height="6" />
          <rect x="574" y="92" width="5" height="6" />
          <rect x="602" y="90" width="5" height="6" />
          <rect x="612" y="96" width="5" height="6" />

          <rect x="784" y="90" width="5" height="6" />
          <rect x="794" y="98" width="5" height="6" />
          <rect x="830" y="84" width="5" height="6" />
          <rect x="840" y="94" width="5" height="6" />
          <rect x="868" y="94" width="5" height="6" />
          <rect x="878" y="102" width="5" height="6" />
          <rect x="932" y="88" width="5" height="6" />
          <rect x="942" y="100" width="5" height="6" />
          <rect x="966" y="98" width="5" height="6" />
          <rect x="976" y="106" width="5" height="6" />
          <rect x="1024" y="100" width="5" height="6" />
          <rect x="1034" y="108" width="5" height="6" />
          <rect x="1066" y="106" width="5" height="6" />
          <rect x="1076" y="116" width="5" height="6" />
          <rect x="1076" y="100" width="5" height="6" />
          <rect x="1138" y="118" width="5" height="6" />
          <rect x="1148" y="122" width="5" height="6" />
          <rect x="1172" y="116" width="5" height="6" />
          <rect x="1182" y="128" width="5" height="6" />
          <rect x="1228" y="126" width="5" height="6" />
          <rect x="1238" y="134" width="5" height="6" />
          <rect x="1266" y="126" width="5" height="6" />
          <rect x="1276" y="138" width="5" height="6" />
          <rect x="1330" y="114" width="5" height="6" />
          <rect x="1338" y="128" width="5" height="6" />
          <rect x="1346" y="114" width="5" height="6" />
          <rect x="1366" y="142" width="5" height="6" />
          <rect x="1376" y="150" width="5" height="6" />
          <rect x="1404" y="146" width="5" height="6" />

          <rect x="700" y="88" width="5" height="6" />
          <rect x="736" y="88" width="5" height="6" />
          <rect x="700" y="104" width="5" height="6" />
          <rect x="736" y="104" width="5" height="6" />
        </g>

        {/* Wavy footer edge */}
        <path
          d="M0 220 L0 170 C 120 170 200 150 300 138 C 400 126 480 118 570 122 C 650 126 690 142 760 144 C 830 146 870 126 960 118 C 1060 109 1140 120 1220 136 C 1310 154 1380 168 1440 168 L1440 220 Z"
          fill="var(--color-coal)"
        />
        <path
          d="M0 170 C 120 170 200 150 300 138 C 400 126 480 118 570 122 C 650 126 690 142 760 144 C 830 146 870 126 960 118 C 1060 109 1140 120 1220 136 C 1310 154 1380 168 1440 168"
          fill="none"
          stroke="var(--color-gold)"
          strokeOpacity="0.22"
          strokeWidth="1"
        />
      </svg>
    </div>
  )
}
