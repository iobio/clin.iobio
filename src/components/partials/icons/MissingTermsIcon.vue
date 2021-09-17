<template>
  <div>
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="140" viewBox="0 0 539 426">
      <defs>
        <linearGradient id="linear-gradient" x1="0.596" y1="1" x2="1" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0" style="stop-color:#e6e6e6; stop-opacity:1"/>
          <stop offset="1" style="stop-color:#d5d5d5; stop-opacity:1"/>
        </linearGradient>
        <filter id="Rectangle_1" x="7" y="0" width="351" height="385" filterUnits="userSpaceOnUse">
          <feOffset dy="3" input="SourceAlpha"/>
          <feGaussianBlur stdDeviation="10" result="blur"/>
          <feFlood flood-opacity="0.302"/>
          <feComposite operator="in" in2="blur"/>
          <feComposite in="SourceGraphic"/>
        </filter>
      </defs>
      <g id="Group_4" data-name="Group 4" transform="translate(-186 -480)">
        <g id="Group_2" data-name="Group 2" transform="translate(369.165 -20.318) rotate(14)">
          <rect id="Rectangle_1-2" data-name="Rectangle 1" width="269.018" height="325" transform="translate(223 507)" fill="#efefef"/>
          <rect id="Rectangle_2" data-name="Rectangle 2" width="225.018" height="277" transform="translate(245 531)" fill="#fff"/>
          <rect id="Rectangle_6" data-name="Rectangle 6" width="175" height="39" transform="translate(241.081 573.375)" :fill="tab == 0? 'url(#linear-gradient)' : '#e1e1e1'"/>
          <rect id="Rectangle_7" data-name="Rectangle 7" width="109" height="35" transform="translate(254.91 632.835)" fill="#f2f2f2"/>
        </g>
        <g id="Group_1" data-name="Group 1">
          <g transform="matrix(1, 0, 0, 1, 186, 480)" filter="url(#Rectangle_1)">
            <rect id="Rectangle_1-3" data-name="Rectangle 1" width="291" height="325" transform="translate(37 27)" fill="#efefef"/>
          </g>
          <rect id="Rectangle_2-2" data-name="Rectangle 2" width="247" height="277" transform="translate(245 531)" fill="#fff"/>
          <rect id="Rectangle_6-2" data-name="Rectangle 6" width="177" height="36" transform="translate(268 578)" :fill="tab == 0? 'url(#linear-gradient)' : '#e1e1e1'"/>
          <rect id="Rectangle_7-2" data-name="Rectangle 7" width="109" height="35" transform="translate(274 630)" fill="#f2f2f2"/>
          <rect id="Rectangle_8" data-name="Rectangle 8" width="156" height="22" transform="translate(268 760)" fill="#e1e1e1"/>
        </g>
        <circle id="Ellipse_7" data-name="Ellipse 7" cx="31" cy="31" r="31" transform="translate(428 777)" fill="rgba(72,132,229,0.84)"/>
        <g id="Group_3" data-name="Group 3" transform="translate(-299 21)">
          <g id="Rectangle_9" data-name="Rectangle 9" transform="translate(736 765)" fill="none" stroke="#fff" stroke-width="1">
            <rect width="18" height="18" stroke="none"/>
            <rect x="0.5" y="0.5" width="17" height="17" fill="none"/>
          </g>
          <g id="Rectangle_13" data-name="Rectangle 13" transform="translate(761 765)" fill="none" stroke="#fff" stroke-width="1">
            <rect width="18" height="18" stroke="none"/>
            <rect x="0.5" y="0.5" width="17" height="17" fill="none"/>
          </g>
          <g id="Rectangle_14" data-name="Rectangle 14" transform="translate(761 790)" fill="none" stroke="#fff" stroke-width="1">
            <rect width="18" height="18" stroke="none"/>
            <rect x="0.5" y="0.5" width="17" height="17" fill="none"/>
          </g>
          <g id="Rectangle_15" data-name="Rectangle 15" transform="translate(736 790)" fill="none" stroke="#fff" stroke-width="1">
            <rect width="18" height="18" stroke="none"/>
            <rect x="0.5" y="0.5" width="17" height="17" fill="none"/>
          </g>
        </g>
        <circle id="Ellipse_8" data-name="Ellipse 8" cx="9" cy="9" r="9" transform="translate(673 888)" fill="#f7cbae"/>
        <g id="Ellipse_9" data-name="Ellipse 9" transform="translate(663 851)" fill="#c7c7c7" stroke="#d6d6d6" stroke-width="1">
          <circle cx="14" cy="14" r="14" stroke="none"/>
          <circle cx="14" cy="14" r="13.5" fill="none"/>
        </g>
        <circle id="Ellipse_10" data-name="Ellipse 10" cx="7" cy="7" r="7" transform="translate(704 851)" fill="#e6e6e6"/>
        <circle id="Ellipse_11" data-name="Ellipse 11" cx="7.5" cy="7.5" r="7.5" transform="translate(710 562)" fill="#f0899d"/>
        <ellipse id="Ellipse_12" data-name="Ellipse 12" cx="8.5" cy="10" rx="8.5" ry="10" transform="translate(199 845)" fill="#d5d3f0"/>
        <g id="Ellipse_13" data-name="Ellipse 13" transform="translate(186 532)" fill="#c7c7c7" stroke="#c7c7c7" stroke-width="1">
          <ellipse cx="9" cy="8.5" rx="9" ry="8.5" stroke="none"/>
          <ellipse cx="9" cy="8.5" rx="8.5" ry="8" fill="none"/>
        </g>
      </g>
    </svg>
  </div>
</template>

<script>
  export default {
    name: 'MissingTermsIcon',
    props: {
      tab: 0, 
    },
    data (){
      return {
      }
    }
  }
</script>
