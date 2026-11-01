import React from 'react';
export default function Character({ name, ...props }) {
  const lia = name === 'Lia';
  return <svg viewBox="0 0 240 240" role="img" aria-label={lia ? 'Lia, ajolote rosa con branquias externas' : 'Rocko, xoloitzcuintle sin pelo de orejas grandes'} {...props}>
    <ellipse cx="120" cy="218" rx="56" ry="8" fill="#273f4620"/>
    {lia ? <g stroke="#c65e87" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M148 184 Q207 166 189 122 Q224 175 171 205 L143 203" fill="#ef91b1"/>
      <path d="M87 164 Q69 184 76 204 Q84 215 95 204 L105 185 M145 170 Q165 187 160 207 Q149 216 141 201" fill="#f4aec5"/>
      <ellipse cx="120" cy="170" rx="39" ry="43" fill="#f6b9cf"/>
      <ellipse cx="120" cy="180" rx="24" ry="28" fill="#ffdae4" stroke="none"/>
      <path d="M77 94 L49 67 M72 110 L35 102 M77 125 L47 143 M163 94 L191 67 M168 110 L205 102 M163 125 L193 143" fill="none" stroke="#e075a1" strokeWidth="11"/>
      <path d="M50 69 L47 53 M51 72 L35 69 M38 102 L26 91 M40 104 L25 112 M50 141 L34 139 M50 140 L44 155 M190 69 L193 53 M189 72 L205 69 M202 102 L214 91 M200 104 L215 112 M190 141 L206 139 M190 140 L196 155" stroke="#f091b7" strokeWidth="7"/>
      <path d="M68 104 Q65 65 120 65 Q175 65 172 104 L169 121 Q159 147 120 147 Q81 147 71 121Z" fill="#f7b1cc"/>
      <path d="M92 169 L71 183 M149 168 L169 180" strokeWidth="13" stroke="#ef9fbd"/>
      <g stroke="none"><ellipse cx="86" cy="119" rx="12" ry="7" fill="#ed83a8"/><ellipse cx="154" cy="119" rx="12" ry="7" fill="#ed83a8"/></g>
    </g> : <g stroke="#363c50" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round">
      <path d="M151 184 Q198 168 179 149 Q209 177 164 200" fill="none" strokeWidth="9"/>
      <path d="M84 172 L83 208 Q91 219 102 208 L107 184 M140 179 L144 210 Q155 218 164 207 L158 175" fill="#60677d"/>
      <ellipse cx="122" cy="169" rx="39" ry="42" fill="#62697f"/>
      <path d="M101 159 Q119 146 140 160 L134 194 L111 194Z" fill="#8b91a2" stroke="none"/>
      <path d="M76 96 Q56 65 65 21 Q101 43 104 86 M137 84 Q147 43 179 22 Q187 66 163 101" fill="#62697f"/>
      <path d="M77 76 L73 42 L93 78 M150 79 L172 43 L164 81" fill="#ad8597" stroke="none"/>
      <path d="M72 101 Q73 75 120 76 Q166 75 170 103 L162 131 Q143 153 120 150 Q92 148 77 129Z" fill="#70788f"/>
      <path d="M111 77 L116 64 L121 75 L128 63 L133 78" fill="#42495e"/>
      <ellipse cx="121" cy="126" rx="25" ry="17" fill="#9297a8" stroke="none"/>
      <path d="M112 119 Q121 112 130 119 L121 126Z" fill="#363c50"/>
      <path d="M89 168 L73 186 M151 168 L169 182" strokeWidth="13" stroke="#62697f"/>
    </g>}
    <g fill="#303448"><ellipse cx="96" cy="106" rx="5" ry="7"/><ellipse cx="145" cy="106" rx="5" ry="7"/></g>
    <g fill="white"><circle cx="97" cy="104" r="1.8"/><circle cx="146" cy="104" r="1.8"/></g>
    <path d={lia ? 'M110 122 Q120 132 131 122' : 'M111 131 Q121 139 132 130'} fill="none" stroke="#3e3c4e" strokeWidth="3" strokeLinecap="round"/>
  </svg>;
}
