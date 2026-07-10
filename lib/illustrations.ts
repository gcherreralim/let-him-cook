// Gabby's Cookbook — hand-drawn illustration library + auto-matching.
// Every recipe's picture is derived from its title/tags at render time.

export const ILLO: Record<string,string> ={
  noodles:`<svg viewBox="0 0 200 150" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="150" fill="#F1DFBE"/>
    <g stroke="#3E2F26" stroke-width="2.4" fill="none" stroke-linecap="round">
      <ellipse cx="100" cy="95" rx="62" ry="30" fill="#EBDCC1"/>
      <ellipse cx="100" cy="90" rx="62" ry="30" fill="#FBF5E9"/>
      <path d="M55 88c8-14 20-16 30-8M70 82c10-12 24-10 32 2M92 80c8-12 26-12 34 2M112 84c8-10 20-10 26 0" stroke="#DBA23C" stroke-width="3"/>
      <path d="M62 92c10-8 24-6 30 2M88 94c10-8 26-6 34 2" stroke="#B8801E" stroke-width="2.6"/>
      <circle cx="128" cy="78" r="7" fill="#CE5138"/><circle cx="74" cy="76" r="6" fill="#CE5138"/>
      <path d="M100 60c-3-8 2-14 6-16" stroke="#9A836E" stroke-width="2"/>
      <path d="M112 58c-2-7 2-12 6-14" stroke="#9A836E" stroke-width="2"/>
    </g>
    <path d="M40 116c14 6 34 9 60 9s46-3 60-9" stroke="#7E8C5C" stroke-width="2.4" fill="none"/>
  </svg>`,
  salmon:`<svg viewBox="0 0 200 150" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="150" fill="#EDE3CF"/>
    <g stroke="#3E2F26" stroke-width="2.4" fill="none">
      <ellipse cx="100" cy="92" rx="66" ry="32" fill="#FBF5E9"/>
      <path d="M62 96c8-4 18-4 26 0" stroke="#fff" stroke-width="2" opacity=".6"/>
      <rect x="70" y="70" width="60" height="34" rx="9" fill="#D8785C"/>
      <path d="M78 78h44M78 87h44M78 96h44" stroke="#A63A24" stroke-width="2"/>
      <circle cx="150" cy="80" r="9" fill="#F3D26B"/>
      <path d="M45 78c6-2 10 2 8 8" stroke="#7E8C5C" stroke-width="3"/>
      <path d="M52 72c6-2 12 2 10 9" stroke="#7E8C5C" stroke-width="3"/>
    </g>
  </svg>`,
  chicken:`<svg viewBox="0 0 200 150" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="150" fill="#F1DDBF"/>
    <g stroke="#3E2F26" stroke-width="2.4" fill="none">
      <ellipse cx="100" cy="94" rx="70" ry="34" fill="#3f3227"/>
      <ellipse cx="100" cy="89" rx="70" ry="34" fill="#EAD9B8"/>
      <path d="M60 84c6-14 24-18 34-6 8-8 24-6 28 6 6-2 12 4 8 12-6 10-64 12-76 2-4-6 0-12 6-14Z" fill="#C97B3A"/>
      <path d="M70 82c4-6 12-8 18-2M96 80c6-6 16-4 20 4" stroke="#8a4f1f" stroke-width="2"/>
      <circle cx="150" cy="80" r="6" fill="#CE5138"/><circle cx="52" cy="86" r="5" fill="#CE5138"/>
      <path d="M132 74c-2-8 3-13 8-14" stroke="#9A836E" stroke-width="2"/>
      <path d="M120 72c-2-6 2-11 7-12" stroke="#9A836E" stroke-width="2"/>
      <path d="M40 84c4-4 8-3 9 1M45 78l3 4" stroke="#7E8C5C" stroke-width="2.6"/>
    </g>
  </svg>`,
  noodlesCold:`<svg viewBox="0 0 200 150" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="150" fill="#E7E0CB"/>
    <g stroke="#3E2F26" stroke-width="2.4" fill="none" stroke-linecap="round">
      <path d="M40 100c14 14 106 14 120 0v-4c-14 12-106 12-120 0Z" fill="#7E8C5C"/>
      <ellipse cx="100" cy="82" rx="58" ry="26" fill="#FBF5E9"/>
      <path d="M56 82c10-10 24-8 30 2M78 78c10-10 26-8 34 2M100 80c8-10 24-8 30 2" stroke="#DBA23C" stroke-width="3"/>
      <path d="M64 88c8-6 20-4 26 2" stroke="#B8801E" stroke-width="2.4"/>
      <circle cx="120" cy="74" r="5" fill="#CE5138"/>
      <path d="M84 70c-2 4-8 5-10 2" stroke="#5C6A3E" stroke-width="2.4"/>
      <path d="M110 68c-2 4-8 5-10 2" stroke="#5C6A3E" stroke-width="2.4"/>
    </g>
  </svg>`,
  bread:`<svg viewBox="0 0 200 150" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="150" fill="#EEDFC0"/>
    <g stroke="#3E2F26" stroke-width="2.4" fill="none">
      <path d="M50 100c0-26 100-26 100 0v6c0 6-100 6-100 0Z" fill="#C88A46"/>
      <path d="M50 100c0-26 100-26 100 0" fill="#D89B54"/>
      <path d="M64 92l72 0M60 100l80 0" stroke="#8a5a24" stroke-width="2"/>
      <path d="M78 70c2-6 8-6 10 0M100 66c2-6 8-6 10 0M118 72c2-5 7-5 9 0" stroke="#5E4633" stroke-width="2.2"/>
      <path d="M40 118c20 6 100 6 120 0" stroke="#7E8C5C" stroke-width="2.4"/>
    </g>
  </svg>`,
  stew:`<svg viewBox="0 0 200 150" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="150" fill="#F0DCBD"/>
    <g stroke="#3E2F26" stroke-width="2.4" fill="none">
      <path d="M46 86h108l-8 34c-1 5-6 8-11 8H65c-5 0-10-3-11-8Z" fill="#CE5138"/>
      <ellipse cx="100" cy="86" rx="54" ry="14" fill="#D96B4E"/>
      <circle cx="82" cy="86" r="6" fill="#E7CE8E"/><circle cx="104" cy="88" r="6" fill="#E7CE8E"/><circle cx="120" cy="84" r="5" fill="#7E8C5C"/><circle cx="90" cy="90" r="4" fill="#7E8C5C"/>
      <path d="M40 86h120" stroke="#3E2F26" stroke-width="3"/>
      <path d="M84 68c-3-8 2-13 6-15M104 66c-3-8 2-13 6-15" stroke="#9A836E" stroke-width="2"/>
    </g>
  </svg>`,
  pancake:`<svg viewBox="0 0 200 150" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="150" fill="#EFE1C4"/>
    <g stroke="#3E2F26" stroke-width="2.4" fill="none">
      <ellipse cx="100" cy="112" rx="60" ry="12" fill="#EBDCC1"/>
      <ellipse cx="100" cy="104" rx="52" ry="14" fill="#D89B54"/>
      <ellipse cx="100" cy="94" rx="52" ry="14" fill="#E0A94F"/>
      <ellipse cx="100" cy="84" rx="52" ry="14" fill="#D89B54"/>
      <path d="M60 82c10 6 30 8 40 8s30-2 40-8c2 8-4 14-4 14-14 6-58 6-72 0 0 0-6-6-4-14Z" fill="#B8801E"/>
      <path d="M92 64c0-6 8-8 10-2 6-4 12 2 8 8" fill="#CE5138" stroke="#A63A24"/>
    </g>
  </svg>`,
  cookie:`<svg viewBox="0 0 200 150" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="150" fill="#EEDFBE"/>
    <g stroke="#3E2F26" stroke-width="2.4" fill="none">
      <circle cx="100" cy="80" r="42" fill="#D89B54"/>
      <circle cx="86" cy="70" r="5" fill="#5E4633"/><circle cx="112" cy="66" r="5" fill="#5E4633"/><circle cx="120" cy="90" r="5" fill="#5E4633"/><circle cx="82" cy="94" r="5" fill="#5E4633"/><circle cx="100" cy="82" r="5" fill="#5E4633"/>
      <path d="M50 118c20 6 80 6 100 0" stroke="#7E8C5C" stroke-width="2.4"/>
    </g>
  </svg>`,
  soup:`<svg viewBox="0 0 200 150" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="150" fill="#EFE0C3"/>
    <g stroke="#3E2F26" stroke-width="2.4" fill="none">
      <path d="M52 82h96l-6 30c-1 6-6 10-12 10H70c-6 0-11-4-12-10Z" fill="#DBA23C"/>
      <ellipse cx="100" cy="82" rx="48" ry="12" fill="#E7B856"/>
      <circle cx="88" cy="82" r="4" fill="#7E8C5C"/><circle cx="108" cy="80" r="4" fill="#CE5138"/><circle cx="118" cy="84" r="4" fill="#7E8C5C"/>
      <path d="M46 82h108" stroke-width="3"/>
      <path d="M70 64c-3-7 2-12 6-14M92 60c-3-7 2-12 6-14M114 64c-3-7 2-12 6-14" stroke="#9C876F" stroke-width="2"/>
      <path d="M40 82c-6 0-9-4-8-9M160 82c6 0 9-4 8-9" stroke-width="2.4"/>
    </g>
  </svg>`,
  salad:`<svg viewBox="0 0 200 150" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="150" fill="#EEE3C6"/>
    <g stroke="#3E2F26" stroke-width="2.4" fill="none">
      <path d="M48 92c0-8 106-8 106 0l-6 8c-1 4-6 6-10 6H64c-4 0-9-2-10-6Z" fill="#FBF5E9"/>
      <path d="M60 88c4-10 12-14 18-8 4-12 16-14 22-4 6-10 18-8 20 2" fill="#7E8C5C"/>
      <path d="M70 84c3-6 8-8 12-5M96 80c3-7 9-9 13-5M118 84c3-5 8-6 11-3" stroke="#5C6A3E" stroke-width="2"/>
      <circle cx="82" cy="90" r="5" fill="#CE5138"/><circle cx="112" cy="92" r="5" fill="#CE5138"/><circle cx="98" cy="94" r="4" fill="#EAD7B4"/>
      <path d="M52 92h96" stroke-width="2.6"/>
    </g>
  </svg>`,
  ricebowl:`<svg viewBox="0 0 200 150" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="150" fill="#F0E1C4"/>
    <g stroke="#3E2F26" stroke-width="2.4" fill="none">
      <path d="M46 84h108l-9 18c-2 6-8 10-15 10H70c-7 0-13-4-15-10Z" fill="#F3E6C9"/>
      <ellipse cx="100" cy="84" rx="54" ry="13" fill="#FBF5E9"/>
      <path d="M78 82c1-2 4-2 5 0M92 84c1-2 4-2 5 0M106 81c1-2 4-2 5 0" stroke="#DAC6A3"/>
      <path d="M70 78c8-4 20-4 26 0M112 76c6-3 16-3 20 1" stroke="#CE5138" stroke-width="3"/>
      <circle cx="130" cy="76" r="5" fill="#DBA23C"/>
      <path d="M42 84c-5 0-8-4-7-9M158 84c5 0 8-4 7-9" stroke-width="2.4"/>
    </g>
  </svg>`,
  roast:`<svg viewBox="0 0 200 150" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="150" fill="#F0DEC0"/>
    <g stroke="#3E2F26" stroke-width="2.4" fill="none">
      <ellipse cx="100" cy="98" rx="66" ry="16" fill="#EBDCC1"/>
      <ellipse cx="100" cy="86" rx="46" ry="26" fill="#C4813A"/>
      <path d="M62 82c6-4 14-5 18 0M78 78c6-4 14-5 18 0M96 82c6-4 14-5 18 0M114 78c6-4 14-5 18 0" stroke="#8a5a24" stroke-width="2"/>
      <path d="M60 96c14 8 66 8 80 0" stroke="#8a5a24" stroke-width="2"/>
      <path d="M56 70c-3-8 2-13 7-15M134 68c3-8-2-13-7-15" stroke="#9C876F" stroke-width="2"/>
      <circle cx="46" cy="98" r="4" fill="#7E8C5C"/><circle cx="154" cy="96" r="4" fill="#7E8C5C"/>
    </g>
  </svg>`,
  seafood:`<svg viewBox="0 0 200 150" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="150" fill="#EAE2CC"/>
    <g stroke="#3E2F26" stroke-width="2.4" fill="none">
      <path d="M52 84c14-16 82-16 96 0-14 16-82 16-96 0Z" fill="#D9A15E"/>
      <path d="M148 84l16-10v20Z" fill="#C4813A"/>
      <circle cx="70" cy="80" r="2.6" fill="#3E2F26" stroke="none"/>
      <path d="M62 90c14 6 62 6 76 0" stroke="#B8801E" stroke-width="2"/>
      <path d="M52 84c-6-2-9 2-8 6" stroke-width="2.2"/>
      <path d="M60 66c-2-6 2-10 6-11M120 64c2-6-2-10-6-11" stroke="#9C876F" stroke-width="2"/>
    </g>
  </svg>`,
  pasta:`<svg viewBox="0 0 200 150" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="150" fill="#EFE0C3"/>
    <g stroke="#3E2F26" stroke-width="2.4" fill="none">
      <ellipse cx="100" cy="94" rx="60" ry="26" fill="#FBF5E9"/>
      <path d="M56 90c10-8 22-4 28 2M84 86c10-8 24-4 30 2M114 88c8-8 20-6 26 0" stroke="#DBA23C" stroke-width="3"/>
      <path d="M70 100c26 10 54 10 70-2" fill="#CE5138" opacity=".9"/>
      <circle cx="90" cy="86" r="4" fill="#A63A24"/><circle cx="110" cy="96" r="4" fill="#A63A24"/><circle cx="126" cy="84" r="3.4" fill="#7E8C5C"/>
      <path d="M40 94c14 14 106 14 120 0" stroke="#5C6A3E" stroke-width="2"/>
    </g>
  </svg>`,
  eggs:`<svg viewBox="0 0 200 150" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="150" fill="#F1E4C8"/>
    <g stroke="#3E2F26" stroke-width="2.4" fill="none">
      <ellipse cx="100" cy="92" rx="46" ry="22" fill="#FBF5E9"/>
      <circle cx="84" cy="90" r="12" fill="#DBA23C"/>
      <circle cx="120" cy="94" r="12" fill="#DBA23C"/>
      <path d="M60 100c4-2 8 0 9 3M132 102c4-2 8 0 9 3" stroke="#DAC6A3"/>
      <path d="M50 70c8 2 12 10 8 16M150 70c-8 2-12 10-8 16" stroke="#9C876F" stroke-width="2"/>
    </g>
  </svg>`,
  pizza:`<svg viewBox="0 0 200 150" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="150" fill="#EEDFBE"/>
    <g stroke="#3E2F26" stroke-width="2.4" fill="none">
      <path d="M100 40 156 106H44Z" fill="#DBA23C"/>
      <path d="M100 40 156 106H44Z" fill="#DBA23C" opacity="0"/>
      <path d="M56 96c14-24 74-24 88 0" fill="#CE5138"/>
      <path d="M64 92c11-16 61-16 72 0" fill="#F3E6C9"/>
      <circle cx="90" cy="88" r="4" fill="#CE5138"/><circle cx="110" cy="90" r="4" fill="#CE5138"/><circle cx="100" cy="80" r="4" fill="#CE5138"/>
      <circle cx="80" cy="82" r="3" fill="#7E8C5C"/><circle cx="118" cy="82" r="3" fill="#7E8C5C"/>
      <path d="M100 40 156 106H44Z"/>
    </g>
  </svg>`,
  sandwich:`<svg viewBox="0 0 200 150" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="150" fill="#F0E1C4"/>
    <g stroke="#3E2F26" stroke-width="2.4" fill="none">
      <path d="M50 96c0-8 100-8 100 0l-6 8H56Z" fill="#D89B54"/>
      <path d="M54 88h92" stroke="#7E8C5C" stroke-width="5"/>
      <path d="M54 82h92" stroke="#CE5138" stroke-width="5"/>
      <path d="M56 76c0-4 88-4 88 0l-6 6H62Z" fill="#EAD08A"/>
      <path d="M52 96c-3 6 3 6 3 6M148 96c3 6-3 6-3 6" stroke-width="2.2"/>
    </g>
  </svg>`,
  taco:`<svg viewBox="0 0 200 150" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="150" fill="#EFE0C3"/>
    <g stroke="#3E2F26" stroke-width="2.4" fill="none">
      <path d="M50 98c0-24 100-24 100 0Z" fill="#E0A94F"/>
      <path d="M58 92c6-4 12 0 12 4M78 88c6-4 12 0 12 4M98 90c6-4 12 0 12 4M118 88c6-4 10 0 10 4" fill="#C4813A"/>
      <circle cx="70" cy="86" r="3.4" fill="#CE5138"/><circle cx="100" cy="82" r="3.4" fill="#7E8C5C"/><circle cx="122" cy="88" r="3.4" fill="#CE5138"/>
      <path d="M52 98h96" stroke-width="2.8"/>
    </g>
  </svg>`,
  curry:`<svg viewBox="0 0 200 150" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="150" fill="#F0DEC0"/>
    <g stroke="#3E2F26" stroke-width="2.4" fill="none">
      <path d="M48 84h104l-8 26c-1.5 6-7 10-13 10H69c-6 0-11.5-4-13-10Z" fill="#CE5138"/>
      <ellipse cx="100" cy="84" rx="52" ry="13" fill="#D9683F"/>
      <circle cx="84" cy="84" r="5" fill="#DBA23C"/><circle cx="112" cy="86" r="5" fill="#F3E6C9"/><circle cx="98" cy="80" r="4" fill="#7E8C5C"/>
      <path d="M42 84h116" stroke-width="3"/>
      <path d="M78 66c-3-7 2-12 6-14M120 64c-3-7 2-12 6-14" stroke="#9C876F" stroke-width="2"/>
    </g>
  </svg>`,
  pie:`<svg viewBox="0 0 200 150" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="150" fill="#EFE1C4"/>
    <g stroke="#3E2F26" stroke-width="2.4" fill="none">
      <ellipse cx="100" cy="100" rx="56" ry="16" fill="#D89B54"/>
      <path d="M50 92c8-30 92-30 100 0" fill="#E0AA5C"/>
      <path d="M64 90c4-4 6-14 4-20M84 86c2-6 2-16-1-22M104 86c-1-6 0-16 2-22M122 90c-3-5-5-15-3-21" stroke="#C4813A" stroke-width="2"/>
      <path d="M50 92c16 6 84 6 100 0" stroke-width="2.4"/>
    </g>
  </svg>`,
  cake:`<svg viewBox="0 0 200 150" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="150" fill="#EEDFBE"/>
    <g stroke="#3E2F26" stroke-width="2.4" fill="none">
      <path d="M56 112h88v-18c0-6-5-10-11-10H67c-6 0-11 4-11 10Z" fill="#E9C48A"/>
      <path d="M58 84h84v-14c0-5-4-9-9-9H67c-5 0-9 4-9 9Z" fill="#FBF5E9"/>
      <path d="M60 96h80M62 84h76" stroke="#CE5138" stroke-width="2"/>
      <path d="M84 61v-8M100 61v-10M116 61v-8" stroke-width="2.2"/>
      <path d="M84 51c-2-3 0-6 2-6M100 49c-2-3 0-6 2-6M116 51c-2-3 0-6 2-6" fill="#DBA23C" stroke="#B8801E"/>
    </g>
  </svg>`,
  drink:`<svg viewBox="0 0 200 150" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="150" fill="#EFE3C9"/>
    <g stroke="#3E2F26" stroke-width="2.4" fill="none">
      <path d="M78 54h44l-6 58c-.4 4-4 7-8 7H92c-4 0-7.6-3-8-7Z" fill="#FBF5E9"/>
      <path d="M80 70h40l-4 30c-.3 3-3 5-6 5h-20c-3 0-5.7-2-6-5Z" fill="#7E8C5C"/>
      <path d="M84 62h32" stroke-width="2"/>
      <path d="M100 40v-8M92 42l-4-9M108 42l4-9" stroke="#9C876F" stroke-width="2"/>
      <path d="M126 58c6 2 8 8 4 12" stroke-width="2.2"/>
    </g>
  </svg>`,
  dumpling:`<svg viewBox="0 0 200 150" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="150" fill="#EEE1C4"/>
    <g stroke="#3E2F26" stroke-width="2.4" fill="none">
      <ellipse cx="100" cy="102" rx="58" ry="12" fill="#DAC6A3"/>
      <path d="M60 92c0-10 10-16 20-16h10c10 0 20 6 20 16 0 8-9 12-25 12s-25-4-25-12Z" fill="#F3E6C9"/>
      <path d="M62 92c8-4 48-4 56 0" stroke="#DAC6A3"/>
      <path d="M110 90c0-10 10-16 20-16h6c8 0 16 6 16 16 0 7-8 11-21 11s-21-4-21-11Z" fill="#F3E6C9"/>
      <path d="M52 76c-2-6 2-10 6-11M144 74c2-6-2-10-6-11" stroke="#9C876F" stroke-width="2"/>
    </g>
  </svg>`,
  pot:`<svg viewBox="0 0 200 150" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="150" fill="#EFE1C4"/>
    <g stroke="#3E2F26" stroke-width="2.4" fill="none">
      <path d="M54 82h92l-6 24c-1 7-7 12-14 12H74c-7 0-13-5-14-12Z" fill="#DBA23C"/>
      <ellipse cx="100" cy="82" rx="46" ry="12" fill="#B8801E"/>
      <path d="M48 78h12M140 78h12" stroke-width="4"/>
      <path d="M74 62c-3-8 2-13 7-15M126 62c3-8-2-13-7-15" stroke="#9C876F" stroke-width="2"/>
      <path d="M96 58c-3-8 2-13 7-15" stroke="#9C876F" stroke-width="2"/>
    </g>
  </svg>`,
};

const DISH_RULES: [string, string[]][] =[
  ['ricebowl',   ['rice bowl','poke bowl','donburi','bibimbap','sushi bowl','burrito bowl','grain bowl','fried rice']],
  ['soup',       ['noodle soup','soup','broth','bisque','chowder','pho','congee','minestrone']],
  ['noodlesCold',['cold noodle','sesame noodle','soba salad','somen']],
  ['noodles',    ['ramen','udon','stir fry noodle','stir-fry noodle','noodles','noodle','lo mein','chow mein','yakisoba']],
  ['pasta',      ['spaghetti','pasta','penne','fettuccine','linguine','lasagna','carbonara','bolognese','mac and cheese','macaroni','ravioli','gnocchi']],
  ['stew',       ['stew','chili','braise','braised','goulash','tagine']],
  ['curry',      ['curry','masala','tikka','korma','laksa','vindaloo']],
  ['salad',      ['salad','slaw','caprese']],
  ['sandwich',   ['club sandwich','sandwich','burger','hoagie','panini','sub ','wrap','blt']],
  ['taco',       ['taco','quesadilla','fajita','enchilada','nacho','tostada','burrito']],
  ['pizza',      ['pizza','flatbread','focaccia']],
  ['dumpling',   ['dumpling','gyoza','wonton','potsticker','bao','momo']],
  ['eggs',       ['omelet','omelette','frittata','shakshuka','scrambled egg','quiche','benedict']],
  ['pancake',    ['pancake','waffle','crepe','french toast']],
  ['pie',        ['pie','tart','crumble','cobbler']],
  ['cake',       ['cake','cupcake']],
  ['cookie',     ['cookie','biscuit','brownie']],
  ['bread',      ['banana bread','sourdough','baguette','brioche','dinner rolls','loaf','bread']],
  ['drink',      ['smoothie','juice','cocktail','mocktail','lemonade','milkshake','shake','latte','iced coffee']],
];
const INGREDIENT_RULES: [string, string[]][] =[
  ['salmon',     ['salmon','trout']],
  ['seafood',    ['fish','shrimp','prawn','crab','lobster','scallop','clam','mussel','ceviche','tuna','calamari','squid','oyster']],
  ['chicken',    ['chicken','poultry','wing','drumstick','thigh']],
  ['roast',      ['roast','pot roast','brisket','pork loin','turkey','ham ','prime rib','rotisserie','beef roast','lamb']],
  ['eggs',       ['egg','dal']],
];

export const ILLO_LABEL: Record<string,string> ={
  noodles:'Noodles',noodlesCold:'Cold noodles',pasta:'Pasta',salmon:'Salmon',seafood:'Seafood',
  ricebowl:'Rice bowl',chicken:'Chicken',roast:'Roast',stew:'Stew',soup:'Soup',curry:'Curry',
  salad:'Salad',eggs:'Eggs',pancake:'Pancakes',sandwich:'Sandwich',taco:'Tacos',pizza:'Pizza',
  dumpling:'Dumplings',bread:'Bread',cookie:'Cookies',pie:'Pie',cake:'Cake',drink:'A drink',pot:'A cozy pot',
};

export function matchIllustration(title: string, tags?: string[]): string {
  const text = (title + " " + (tags || []).join(" ")).toLowerCase();
  for (const [key, words] of DISH_RULES) {
    for (const w of words) { if (text.includes(w)) return key; }
  }
  for (const [key, words] of INGREDIENT_RULES) {
    for (const w of words) { if (text.includes(w)) return key; }
  }
  return "pot";
}

export function illoSvg(title: string, tags?: string[]): string {
  return ILLO[matchIllustration(title, tags)] || ILLO.pot;
}

export function bearLogo(size = 46): string {
  return `<svg viewBox="0 0 100 100" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" style="overflow:visible">
    <g stroke="#3E2F26" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
      <!-- white shirt: shoulders + sleeves -->
      <path d="M24 92c0-14 9-24 26-24s26 10 26 24Z" fill="#FEFAF2"/>
      <!-- shirt collar notch -->
      <path d="M43 69l7 7 7-7" fill="#FEFAF2"/>
      <!-- blue apron over the shirt, narrower/fitted -->
      <path d="M40 74c0-1.6 1.4-2.6 3-2.6h14c1.6 0 3 1 3 2.6l2.4 18.5H37.6Z" fill="#4E7FA8"/>
      <!-- apron bib -->
      <path d="M43.5 62h13v9.4h-13Z" fill="#4E7FA8"/>
      <!-- neck strap over shoulders -->
      <path d="M45 62c-2-5-6-4.5-6-9M55 62c2-5 6-4.5 6-9" fill="none" stroke-width="2.6"/>
      <!-- apron waist ties -->
      <path d="M40 76c-4 .5-7 .5-9-1M60 76c4 .5 7 .5 9-1" fill="none" stroke-width="2.4"/>
      <!-- apron waist seam -->
      <path d="M39 80h22" stroke="#3E2F26" stroke-width="2.2"/>
      <!-- ears -->
      <circle cx="32" cy="27" r="9.5" fill="#B98748"/>
      <circle cx="68" cy="27" r="9.5" fill="#B98748"/>
      <circle cx="32" cy="27" r="3.8" fill="#8F6533" stroke="none"/>
      <circle cx="68" cy="27" r="3.8" fill="#8F6533" stroke="none"/>
      <!-- head -->
      <circle cx="50" cy="41" r="22" fill="#B98748"/>
      <!-- muzzle -->
      <ellipse cx="50" cy="47" rx="11.5" ry="8.5" fill="#E7D2AD"/>
      <!-- brow line for a calmer, composed look -->
      <path d="M40 34.5c1.6-1 3.4-1 5 0M55 34.5c1.6-1 3.4-1 5 0" fill="none" stroke-width="2.4"/>
      <!-- eyes: smaller, level -->
      <circle cx="42.5" cy="39" r="2.4" fill="#3E2F26" stroke="none"/>
      <circle cx="57.5" cy="39" r="2.4" fill="#3E2F26" stroke="none"/>
      <!-- nose + neutral mouth -->
      <path d="M47 44.5h6l-3 3Z" fill="#3E2F26" stroke-linejoin="round"/>
      <path d="M50 47.5v3M45.5 51.5h9" fill="none"/>
      <!-- paws resting at apron top -->
      <circle cx="37" cy="66" r="4.6" fill="#B98748"/>
      <circle cx="63" cy="66" r="4.6" fill="#B98748"/>
    </g>
  </svg>`;
}
