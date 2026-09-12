/*
 * 服务分类配置｜Hako 多机场合并版
 *
 * Hako 会将当前选中的多个节点来源合并到 config.proxies。
 * 本脚本不依赖任何 proxy-providers 名称。
 *
 * 结构：
 * 1. 主策略组
 * 2. 普通服务策略组
 * 3. 根据实际节点动态生成地区 Auto
 * 4. APNs-Fallback
 * 5. Rules
 * 6. Rule Providers
 */

function main(config) {
  // Hako 当前选中的所有机场节点都会合并到 config.proxies。
  const currentProxies = Array.isArray(config && config.proxies)
    ? config.proxies
    : [];

  const currentProxyNames = currentProxies
    .map(p =>
      typeof p === "string"
        ? p
        : (p && typeof p.name === "string" ? p.name : null)
    )
    .filter(Boolean);

  const fixed = {
    "mixed-port": 7890,
    "allow-lan": false,
    "bind-address": "*",
    "mode": "rule",
    "log-level": "info",
    "external-controller": "127.0.0.1:9090",
    "unified-delay": true,
    "tcp-concurrent": true,
    "ipv6": true,

    "tun": {
      "enable": true,
      "stack": "gvisor",
      "auto-route": true,
      "auto-detect-interface": true,
      "strict-route": true,
      "dns-hijack": [
        "any:53"
      ]
    },

    "dns": {
      "enable": true,
      "respect-rules": true,
      "ipv6": true,
      "prefer-h3": false,
      "enhanced-mode": "fake-ip",
      "fake-ip-range": "198.18.0.1/16",

      "default-nameserver": [
        "223.5.5.5",
        "119.29.29.29",
        "2400:3200::1"
      ],

      "nameserver": [
        "https://dns.cloudflare.com/dns-query",
        "https://dns.google/dns-query"
      ],

      "proxy-server-nameserver-policy": null,

      "proxy-server-nameserver": [
        "https://dns.alidns.com/dns-query",
        "https://doh.pub/dns-query"
      ],

      "direct-nameserver": [
        "https://dns.alidns.com/dns-query",
        "https://doh.pub/dns-query"
      ],

      "nameserver-policy": {
        "dns.cloudflare.com": [
          "1.1.1.1",
          "1.0.0.1"
        ],

        "dns.google": [
          "8.8.8.8",
          "8.8.4.4"
        ],

        "dns.quad9.net": [
          "9.9.9.9",
          "149.112.112.112"
        ],

        "dns.alidns.com": [
          "223.5.5.5",
          "223.6.6.6"
        ],

        "doh.pub": [
          "1.12.12.12",
          "120.53.53.53"
        ],

        "geosite:cn": [
          "https://dns.alidns.com/dns-query",
          "https://doh.pub/dns-query"
        ]
      },

      "fallback": [
        "https://anycast.uncensoreddns.org/dns-query"
      ],

      "fallback-filter": {
        "geoip": true,
        "geoip-code": "CN",
        "ipcidr": [
          "240.0.0.0/4",
          "127.0.0.0/8",
          "0.0.0.0/32"
        ]
      },

      "fake-ip-filter": [
        "*.lan",
        "*.local",
        "localhost",
        "*.msftconnecttest.com",
        "*.msftncsi.com",
        "*.msidentity.com",
        "captive.apple.com",
        "*.push.apple.com",
        "stun.*",
        "+.stun.*.*",
        "+.stun.*.*.*",
        "+.stun.*.*.*.*",
        "+.stun.*.*.*.*.*",
        "+.weixin.com",
        "+.wechat.com",
        "+.qq.com",
        "+.tencent.com",
        "speedtest.net"
      ]
    },

    "profile": {
      "store-selected": true,
      "store-fake-ip": true
    }
  };

  // ============================================================
  // 节点池
  // ============================================================

  fixed.proxies = currentProxies;
  fixed["proxy-groups"] = [];

  // ============================================================
  // 1. 主策略组
  //
  // Auto 组故意不在这里生成。
  // Auto 会在所有普通服务策略组之后生成。
  // ============================================================

  fixed["proxy-groups"].push(
    {
      "name": "PROXY-Gate",
      "type": "select",
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Final.png",
      "proxies": [
        "🖥️ All-Nodes",
        "DIRECT"
      ]
    },

    {
      "name": "Apple Push",
      "type": "fallback",
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Apple.png",
      "proxies": [
        "APNs-Fallback",
        "DIRECT"
      ],
      "url": "http://captive.apple.com/hotspot-detect.html",
      "interval": 300
    },

    {
      "name": "🖥️ All-Nodes",
      "type": "select",
      "proxies": currentProxyNames.slice(),
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Server.png"
    }
  );

  // ============================================================
  // 2. 普通服务策略组
  //
  // 这里暂时只放 All-Nodes / PROXY-Gate / DIRECT。
  // 后面检测完节点地区后，再把实际存在的 Auto 组插入。
  //
  // 因此：
  // 没有法国节点 → 不会出现 FR-Auto
  // 没有俄罗斯节点 → 不会出现 RU-Auto
  // ============================================================

  fixed["proxy-groups"].push({
    "name": "YouTube",
    "type": "select",
    "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/YouTube.png",
    "proxies": [
      "🖥️ All-Nodes",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  fixed["proxy-groups"].push({
    "name": "Netflix",
    "type": "select",
    "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Netflix.png",
    "proxies": [
      "🖥️ All-Nodes",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  fixed["proxy-groups"].push({
    "name": "Disney+",
    "type": "select",
    "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Disney+.png",
    "proxies": [
      "🖥️ All-Nodes",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  fixed["proxy-groups"].push({
    "name": "Spotify",
    "type": "select",
    "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Spotify.png",
    "proxies": [
      "🖥️ All-Nodes",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  fixed["proxy-groups"].push({
    "name": "TikTok",
    "type": "select",
    "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/TikTok.png",
    "proxies": [
      "🖥️ All-Nodes",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  fixed["proxy-groups"].push({
    "name": "Twitch",
    "type": "select",
    "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Twitch.png",
    "proxies": [
      "🖥️ All-Nodes",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  fixed["proxy-groups"].push({
    "name": "GPT",
    "type": "select",
    "icon": "https://fastly.jsdelivr.net/gh/shindgewongxj/WHATSINStash/icon/openai.png",
    "proxies": [
      "🖥️ All-Nodes",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  fixed["proxy-groups"].push({
    "name": "Gemini",
    "type": "select",
    "icon": "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/google-gemini.png",
    "proxies": [
      "🖥️ All-Nodes",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  fixed["proxy-groups"].push({
    "name": "Claude",
    "type": "select",
    "icon": "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/anthropic.png",
    "proxies": [
      "🖥️ All-Nodes",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  fixed["proxy-groups"].push({
    "name": "Copilot",
    "type": "select",
    "icon": "https://fastly.jsdelivr.net/gh/Hawaiine/Oasisic-Icons@main/icons/Microsoft/Copilot-1.png",
    "proxies": [
      "🖥️ All-Nodes",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  fixed["proxy-groups"].push({
    "name": "Grok",
    "type": "select",
    "icon": "https://raw.githubusercontent.com/luestr/IconResource/main/App_icon/120px/Grok.png",
    "proxies": [
      "🖥️ All-Nodes",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  fixed["proxy-groups"].push({
    "name": "Google",
    "type": "select",
    "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Google.png",
    "proxies": [
      "🖥️ All-Nodes",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  // Apple 紧跟 Google
  fixed["proxy-groups"].push({
    "name": "Apple",
    "type": "select",
    "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Apple.png",
    "proxies": [
      "🖥️ All-Nodes",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  fixed["proxy-groups"].push({
    "name": "X",
    "type": "select",
    "icon": "https://fastly.jsdelivr.net/gh/shindgewongxj/WHATSINStash/icon/x.png",
    "proxies": [
      "🖥️ All-Nodes",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  fixed["proxy-groups"].push({
    "name": "Facebook",
    "type": "select",
    "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Facebook.png",
    "proxies": [
      "🖥️ All-Nodes",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  fixed["proxy-groups"].push({
    "name": "Instagram",
    "type": "select",
    "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Instagram.png",
    "proxies": [
      "🖥️ All-Nodes",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  fixed["proxy-groups"].push({
    "name": "WhatsApp",
    "type": "select",
    "icon": "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/whatsapp.png",
    "proxies": [
      "🖥️ All-Nodes",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  fixed["proxy-groups"].push({
    "name": "Telegram",
    "type": "select",
    "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Telegram.png",
    "proxies": [
      "🖥️ All-Nodes",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  fixed["proxy-groups"].push({
    "name": "Github",
    "type": "select",
    "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/GitHub.png",
    "proxies": [
      "🖥️ All-Nodes",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  fixed["proxy-groups"].push({
    "name": "Speedtest",
    "type": "select",
    "icon": "https://cdn.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Speedtest.png",
    "proxies": [
      "🖥️ All-Nodes",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  // ============================================================
  // 3. 地区 Auto
  //
  // 直接读取 Hako 合并后的完整 config.proxies。
  //
  // 没有节点的地区不会生成策略组。
  // ============================================================

  const regionGroups = [
    {
      key: "US",
      name: "🇺🇸 US",
      filter: /([\[]US[\]]|^US$|USA|United[ _-]?States|\bUS\b|美国|美國|🇺🇸)/i,
      icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/United_States.png"
    },

    {
      key: "SG",
      name: "🇸🇬 SG",
      filter: /([\[]SG[\]]|^SG$|Singapore|\bSG\b|新加坡|狮城|🇸🇬)/i,
      icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Singapore.png"
    },

    {
      key: "HK",
      name: "🇭🇰 HK",
      filter: /([\[]HK[\]]|^HK$|Hong[ _-]?Kong|\bHK\b|香港|🇭🇰)/i,
      icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Hong_Kong.png"
    },

    {
      key: "JP",
      name: "🇯🇵 JP",
      filter: /([\[]JP[\]]|^JP$|Japan|\bJP\b|日本|东京|大阪|🇯🇵)/i,
      icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Japan.png"
    },

    {
      key: "TW",
      name: "🇹🇼 TW",
      filter: /([\[]TW[\]]|^TW$|Taiwan|Taibei|Taipei|\bTW\b|台湾|臺灣|台北|高雄|🇹🇼)/i,
      icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Taiwan.png"
    },

    {
      key: "UK",
      name: "🇬🇧 UK",
      filter: /([\[]UK[\]]|^UK$|United[ _-]?Kingdom|Britain|England|\bUK\b|英国|英國|伦敦|🇬🇧)/i,
      icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/United_Kingdom.png"
    },

    {
      key: "DE",
      name: "🇩🇪 DE",
      filter: /([\[]DE[\]]|^DE$|Germany|Deutschland|\bDE\b|德国|德國|法兰克福|🇩🇪)/i,
      icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Germany.png"
    },

    {
      key: "FR",
      name: "🇫🇷 FR",
      filter: /([\[]FR[\]]|^FR$|France|\bFR\b|法国|法國|巴黎|🇫🇷)/i,
      icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/France.png"
    },

    {
      key: "RU",
      name: "🇷🇺 RU",
      filter: /([\[]RU[\]]|^RU$|Russia|Russian[ _-]?Federation|\bRU\b|俄罗斯|俄羅斯|莫斯科|伯力|🇷🇺)/i,
      icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Russia.png"
    }
  ];

  const existingRegionalAutos = [];

  regionGroups.forEach(region => {
    const matched = currentProxyNames.filter(
      name => region.filter.test(name)
    );

    const autoName = region.name + "-Auto";

    // 没有节点则完全不生成该地区组。
    if (matched.length === 0) {
      return;
    }

    fixed["proxy-groups"].push({
      name: autoName,
      type: "url-test",
      proxies: matched,
      icon: region.icon,
      url: "http://www.gstatic.com/generate_204",
      interval: 900,
      tolerance: 50
    });

    existingRegionalAutos.push(autoName);
  });

  // ============================================================
  // 4. 将实际存在的 Auto 组加入服务策略组
  //
  // 例如：
  // 如果实际只有 US / SG / JP：
  //
  // YouTube:
  // All-Nodes
  // US-Auto
  // SG-Auto
  // JP-Auto
  // PROXY-Gate
  // DIRECT
  //
  // 不会出现不存在的 FR-Auto / RU-Auto。
  // ============================================================

  const serviceProxyChoices = [
    "🖥️ All-Nodes",
    ...existingRegionalAutos,
    "PROXY-Gate",
    "DIRECT"
  ];

  const serviceGroupNames = [
    "YouTube",
    "Netflix",
    "Disney+",
    "Spotify",
    "TikTok",
    "Twitch",
    "GPT",
    "Gemini",
    "Claude",
    "Copilot",
    "Grok",
    "Google",
    "Apple",
    "X",
    "Facebook",
    "Instagram",
    "WhatsApp",
    "Telegram",
    "Github",
    "Speedtest"
  ];

  fixed["proxy-groups"].forEach(group => {
    if (serviceGroupNames.includes(group.name)) {
      group.proxies = serviceProxyChoices.slice();
    }
  });

  // ============================================================
  // 5. PROXY-Gate
  //
  // 同样只加入实际存在的地区 Auto。
  // ============================================================

  const proxyGate = fixed["proxy-groups"].find(
    group => group.name === "PROXY-Gate"
  );

  if (proxyGate) {
    proxyGate.proxies = [
      "🖥️ All-Nodes",
      ...existingRegionalAutos,
      "DIRECT"
    ];
  }

  // ============================================================
  // 6. Apple Push 专用 APNs-Fallback
  //
  // 只引用实际生成的地区 Auto。
  //
  // Apple Push 本身仍然保持：
  // Apple Push
  //   ├─ APNs-Fallback
  //   └─ DIRECT
  //
  // APNs-Fallback：
  //   ├─ US-Auto（如果存在）
  //   ├─ SG-Auto（如果存在）
  //   ├─ HK-Auto（如果存在）
  //   └─ ...
  // ============================================================

  fixed["proxy-groups"].push({
    name: "APNs-Fallback",
    type: "fallback",
    proxies: existingRegionalAutos,
    icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Apple.png",
    url: "http://captive.apple.com/hotspot-detect.html",
    interval: 300
  });

  // ============================================================
  // Rules
  // ============================================================

  fixed.rules = [
    "IP-CIDR,192.168.0.0/16,DIRECT,no-resolve",
    "IP-CIDR,10.0.0.0/8,DIRECT,no-resolve",
    "IP-CIDR,172.16.0.0/12,DIRECT,no-resolve",
    "IP-CIDR,127.0.0.0/8,DIRECT,no-resolve",
    "GEOIP,LAN,DIRECT,no-resolve",

    // Apple Push 必须在普通 Apple 规则之前
    "DOMAIN-SUFFIX,push.apple.com,Apple Push",
    "DOMAIN-SUFFIX,push-apple.com.akadns.net,Apple Push",
    "DOMAIN-KEYWORD,apple.com.edgekey.net,Apple Push",

    "IP-CIDR,17.249.0.0/16,Apple Push,no-resolve",
    "IP-CIDR,17.252.0.0/16,Apple Push,no-resolve",
    "IP-CIDR,17.57.144.0/22,Apple Push,no-resolve",
    "IP-CIDR,17.188.128.0/18,Apple Push,no-resolve",
    "IP-CIDR,17.188.20.0/23,Apple Push,no-resolve",

    "IP-CIDR6,2620:149:a44::/48,Apple Push,no-resolve",
    "IP-CIDR6,2403:300:a42::/48,Apple Push,no-resolve",
    "IP-CIDR6,2403:300:a51::/48,Apple Push,no-resolve",
    "IP-CIDR6,2a01:b740:a42::/48,Apple Push,no-resolve",

    // 普通 Apple 流量进入 Apple 策略组
    "RULE-SET,Apple,Apple",
    "RULE-SET,Apple_Domain,Apple",

    // 广告 / 隐私
    "RULE-SET,AdvertisingLite,REJECT",
    "RULE-SET,AdvertisingLite_Domain,REJECT",
    "RULE-SET,Privacy,REJECT",
    "RULE-SET,Privacy_Domain,REJECT",
    "RULE-SET,ACL4SSR_BanAD,REJECT",
    "RULE-SET,ACL4SSR_BanProgramAD,REJECT",

    // YouTube
    "DOMAIN-SUFFIX,youtube.com,YouTube",
    "DOMAIN-SUFFIX,youtu.be,YouTube",
    "DOMAIN-SUFFIX,youtube-nocookie.com,YouTube",
    "DOMAIN-SUFFIX,youtubei.googleapis.com,YouTube",
    "DOMAIN-SUFFIX,youtube.googleapis.com,YouTube",
    "DOMAIN-SUFFIX,ytimg.com,YouTube",
    "DOMAIN-SUFFIX,googlevideo.com,YouTube",
    "DOMAIN-SUFFIX,ggpht.com,YouTube",

    // Netflix
    "DOMAIN-SUFFIX,netflix.com,Netflix",
    "DOMAIN-SUFFIX,netflix.net,Netflix",
    "DOMAIN-SUFFIX,netflix.ca,Netflix",
    "DOMAIN-SUFFIX,nflxext.com,Netflix",
    "DOMAIN-SUFFIX,nflximg.com,Netflix",
    "DOMAIN-SUFFIX,nflximg.net,Netflix",
    "DOMAIN-SUFFIX,nflxsearch.net,Netflix",
    "DOMAIN-SUFFIX,nflxso.net,Netflix",
    "DOMAIN-SUFFIX,nflxvideo.net,Netflix",
    "DOMAIN-SUFFIX,netflixdnstest0.com,Netflix",
    "DOMAIN-SUFFIX,netflixdnstest1.com,Netflix",
    "DOMAIN-SUFFIX,netflixdnstest2.com,Netflix",
    "DOMAIN-SUFFIX,netflixdnstest3.com,Netflix",
    "DOMAIN-SUFFIX,netflixdnstest4.com,Netflix",
    "DOMAIN-SUFFIX,netflixdnstest5.com,Netflix",
    "DOMAIN-SUFFIX,netflixdnstest6.com,Netflix",
    "DOMAIN-SUFFIX,netflixdnstest7.com,Netflix",
    "DOMAIN-SUFFIX,netflixdnstest8.com,Netflix",
    "DOMAIN-SUFFIX,netflixdnstest9.com,Netflix",
    "DOMAIN-SUFFIX,netflixdnstest10.com,Netflix",
    "DOMAIN-SUFFIX,netflixinvestor.com,Netflix",
    "DOMAIN-SUFFIX,netflixtechblog.com,Netflix",
    "DOMAIN,netflix.com.edgesuite.net,Netflix",

    // Disney+
    "DOMAIN-SUFFIX,disneyplus.com,Disney+",
    "DOMAIN-SUFFIX,disney-plus.net,Disney+",
    "DOMAIN-SUFFIX,dssott.com,Disney+",
    "DOMAIN-SUFFIX,dssedge.com,Disney+",
    "DOMAIN-SUFFIX,bamgrid.com,Disney+",
    "DOMAIN-SUFFIX,media.dssott.com,Disney+",
    "DOMAIN-SUFFIX,disney.playback.edge.bamgrid.com,Disney+",
    "DOMAIN-SUFFIX,star.playback.edge.bamgrid.com,Disney+",
    "DOMAIN-SUFFIX,search-api-disney.bamgrid.com,Disney+",

    // Spotify
    "DOMAIN-SUFFIX,spotify.com,Spotify",
    "DOMAIN-SUFFIX,spotifycdn.com,Spotify",
    "DOMAIN-SUFFIX,scdn.co,Spotify",
    "DOMAIN-SUFFIX,spclient.wg.spotify.com,Spotify",
    "DOMAIN-SUFFIX,api-partner.spotify.com,Spotify",
    "DOMAIN-SUFFIX,heads4-ak-spotify-com.akamaized.net,Spotify",
    "DOMAIN-SUFFIX,spotifycdn.com,Spotify",

    // TikTok
    "DOMAIN-SUFFIX,tiktok.com,TikTok",
    "DOMAIN-SUFFIX,tiktokcdn.com,TikTok",
    "DOMAIN-SUFFIX,tiktokcdn-us.com,TikTok",
    "DOMAIN-SUFFIX,tiktokv.com,TikTok",
    "DOMAIN-SUFFIX,tiktokd.org,TikTok",
    "DOMAIN-SUFFIX,ibytedtos.com,TikTok",
    "DOMAIN-SUFFIX,ibyteimg.com,TikTok",
    "DOMAIN-SUFFIX,byteoversea.com,TikTok",
    "DOMAIN-SUFFIX,muscdn.com,TikTok",
    "DOMAIN-SUFFIX,musical.ly,TikTok",

    // Twitch
    "DOMAIN-SUFFIX,twitch.tv,Twitch",
    "DOMAIN-SUFFIX,twitchcdn.net,Twitch",
    "DOMAIN-SUFFIX,jtvnw.net,Twitch",
    "DOMAIN-SUFFIX,ttvnw.net,Twitch",
    "DOMAIN-SUFFIX,twitchsvc.net,Twitch",

    // GPT
    "DOMAIN-SUFFIX,chatgpt.com,GPT",
    "DOMAIN-SUFFIX,openai.com,GPT",
    "DOMAIN-SUFFIX,auth.openai.com,GPT",
    "DOMAIN-SUFFIX,oaistatic.com,GPT",
    "DOMAIN-SUFFIX,oaiusercontent.com,GPT",
    "DOMAIN,android.chat.openai.com,GPT",
    "DOMAIN,auth0.openai.com,GPT",
    "DOMAIN,chat.openai.com,GPT",
    "DOMAIN,desktop.chat.openai.com,GPT",
    "DOMAIN,ios.chat.openai.com,GPT",
    "DOMAIN,tcr9i.chat.openai.com,GPT",
    "DOMAIN,cdn.openaimerge.com,GPT",
    "DOMAIN,ws.chatgpt.com,GPT",
    "DOMAIN,setup.auth.openai.com,GPT",
    "DOMAIN,cdn.workos.com,GPT",
    "DOMAIN,forwarder.workos.com,GPT",
    "DOMAIN,images.workoscdn.com,GPT",
    "DOMAIN,workos.imgix.net,GPT",
    "DOMAIN,setup.workos.com,GPT",
    "DOMAIN,ct.sendgrid.net,GPT",
    "DOMAIN,oaistatsig.com,GPT",
    "DOMAIN,intercom.io,GPT",
    "DOMAIN,intercomcdn.com,GPT",
    "DOMAIN,js.intercomcdn.com,GPT",
    "DOMAIN,js.stripe.com,GPT",
    "DOMAIN,o207216.ingest.sentry.io,GPT",
    "DOMAIN,o33249.ingest.sentry.io,GPT",
    "DOMAIN,rum.browser-intake-datadoghq.com,GPT",
    "DOMAIN,challenges.cloudflare.com,GPT",
    "DOMAIN,humb.apple.com,GPT",

    // Gemini
    "DOMAIN-SUFFIX,gemini.google.com,Gemini",
    "DOMAIN-SUFFIX,aistudio.google.com,Gemini",
    "DOMAIN-SUFFIX,deepmind.com,Gemini",
    "DOMAIN-SUFFIX,deepmind.google,Gemini",
    "DOMAIN-SUFFIX,gemini.googleusercontent.com,Gemini",
    "DOMAIN-SUFFIX,makersuite.google.com,Gemini",

    // Claude
    "DOMAIN-SUFFIX,claude.ai,Claude",
    "DOMAIN-SUFFIX,anthropic.com,Claude",
    "DOMAIN-SUFFIX,claudeusercontent.com,Claude",
    "DOMAIN-SUFFIX,claudeusercontent.com.cdn.cloudflare.net,Claude",

    // Copilot
    "DOMAIN-SUFFIX,copilot.microsoft.com,Copilot",
    "DOMAIN-SUFFIX,ai.microsoft.com,Copilot",
    "DOMAIN-SUFFIX,designer.microsoft.com,Copilot",
    "DOMAIN-SUFFIX,copilot.com,Copilot",
    "DOMAIN-KEYWORD,copilot,Copilot",

    // Grok
    "DOMAIN-SUFFIX,grok.com,Grok",
    "DOMAIN-SUFFIX,x.ai,Grok",
    "DOMAIN-KEYWORD,grok,Grok",

    // Google
    "DOMAIN-KEYWORD,google,Google",
    "DOMAIN-SUFFIX,gmail.com,Google",
    "DOMAIN-SUFFIX,googleusercontent.com,Google",
    "DOMAIN-SUFFIX,gstatic.com,Google",
    "DOMAIN-SUFFIX,googleapis.com,Google",
    "DOMAIN-SUFFIX,googleusercontent.com,Google",

    // X
    "DOMAIN-SUFFIX,x.com,X",
    "DOMAIN-SUFFIX,twitter.com,X",
    "DOMAIN-SUFFIX,t.co,X",
    "DOMAIN-SUFFIX,twimg.com,X",

    // Facebook
    "DOMAIN-SUFFIX,facebook.com,Facebook",
    "DOMAIN-SUFFIX,facebook.net,Facebook",
    "DOMAIN-SUFFIX,fbcdn.net,Facebook",
    "DOMAIN-SUFFIX,fbsbx.com,Facebook",
    "DOMAIN-SUFFIX,fb.com,Facebook",

    // Instagram
    "DOMAIN-SUFFIX,instagram.com,Instagram",
    "DOMAIN-SUFFIX,cdninstagram.com,Instagram",
    "DOMAIN-SUFFIX,instagram.net,Instagram",

    // WhatsApp
    "DOMAIN-SUFFIX,whatsapp.com,WhatsApp",
    "DOMAIN-SUFFIX,whatsapp.net,WhatsApp",
    "DOMAIN-SUFFIX,wa.me,WhatsApp",
    "DOMAIN-SUFFIX,whatsapp.org,WhatsApp",

    // Telegram
    "DOMAIN-SUFFIX,telegram.org,Telegram",
    "DOMAIN-SUFFIX,telegram.me,Telegram",
    "DOMAIN-SUFFIX,t.me,Telegram",
    "DOMAIN-SUFFIX,tdesktop.com,Telegram",
    "DOMAIN-SUFFIX,telegra.ph,Telegram",
    "DOMAIN-SUFFIX,telegram.dog,Telegram",

    "IP-CIDR,91.108.4.0/22,Telegram,no-resolve",
    "IP-CIDR,91.108.8.0/22,Telegram,no-resolve",
    "IP-CIDR,91.108.12.0/22,Telegram,no-resolve",
    "IP-CIDR,91.108.16.0/22,Telegram,no-resolve",
    "IP-CIDR,91.108.20.0/22,Telegram,no-resolve",
    "IP-CIDR,91.108.56.0/22,Telegram,no-resolve",
    "IP-CIDR,149.154.160.0/20,Telegram,no-resolve",
    "IP-CIDR6,2001:b28:f23d::/48,Telegram,no-resolve",
    "IP-CIDR6,2001:b28:f23f::/48,Telegram,no-resolve",
    "IP-CIDR6,2001:67c:4e8::/48,Telegram,no-resolve",

    // Github
    "DOMAIN-SUFFIX,github.com,Github",
    "DOMAIN-SUFFIX,githubusercontent.com,Github",
    "DOMAIN-SUFFIX,githubassets.com,Github",
    "DOMAIN-SUFFIX,raw.githubusercontent.com,Github",
    "DOMAIN-SUFFIX,github.io,Github",
    "DOMAIN-SUFFIX,github.dev,Github",
    "DOMAIN-SUFFIX,githubstatus.com,Github",

    // Speedtest
    "DOMAIN-SUFFIX,speedtest.net,Speedtest",
    "DOMAIN-SUFFIX,speedtest.com,Speedtest",
    "DOMAIN-SUFFIX,ookla.com,Speedtest",
    "DOMAIN-SUFFIX,ooklaserver.net,Speedtest",
    "DOMAIN-SUFFIX,ookla.net,Speedtest",
    "DOMAIN-SUFFIX,speedtestcustom.com,Speedtest",

    // 中国大陆
    "RULE-SET,ChinaMax,DIRECT",
    "RULE-SET,ChinaMax_Domain,DIRECT",
    "RULE-SET,ChinaMax_IP,DIRECT",
    "GEOSITE,CN,DIRECT",
    "GEOIP,CN,DIRECT,no-resolve",

    // 最终兜底
    "MATCH,PROXY-Gate"
  ];

  // ============================================================
  // Rule Providers
  // ============================================================

  fixed["rule-providers"] = {
    "Apple": {
      "type": "http",
      "behavior": "classical",
      "format": "yaml",
      "interval": 86400,
      "url": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Apple/Apple.yaml"
    },

    "Apple_Domain": {
      "type": "http",
      "behavior": "domain",
      "format": "mrs",
      "interval": 86400,
      "url": "https://raw.githubusercontent.com/Sydney-Moses/Network-Profiles/refs/heads/main/MRS/Apple_Domain.mrs"
    },

    "AdvertisingLite": {
      "type": "http",
      "behavior": "classical",
      "format": "yaml",
      "interval": 86400,
      "url": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/AdvertisingLite/AdvertisingLite.yaml"
    },

    "AdvertisingLite_Domain": {
      "type": "http",
      "behavior": "domain",
      "format": "mrs",
      "interval": 86400,
      "url": "https://raw.githubusercontent.com/Sydney-Moses/Network-Profiles/refs/heads/main/MRS/AdvertisingLite_Domain.mrs"
    },

    "Privacy": {
      "type": "http",
      "behavior": "classical",
      "format": "yaml",
      "interval": 86400,
      "url": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/Privacy/Privacy.yaml"
    },

    "Privacy_Domain": {
      "type": "http",
      "behavior": "domain",
      "format": "mrs",
      "interval": 86400,
      "url": "https://raw.githubusercontent.com/Sydney-Moses/Network-Profiles/refs/heads/main/MRS/Privacy_Domain.mrs"
    },

    "ACL4SSR_BanAD": {
      "type": "http",
      "behavior": "domain",
      "format": "mrs",
      "interval": 86400,
      "url": "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/mrs/BanAD_domain.mrs"
    },

    "ACL4SSR_BanProgramAD": {
      "type": "http",
      "behavior": "domain",
      "format": "mrs",
      "interval": 86400,
      "url": "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/mrs/BanProgramAD_domain.mrs"
    },

    "ChinaMax": {
      "type": "http",
      "behavior": "classical",
      "format": "yaml",
      "interval": 86400,
      "url": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/ChinaMax/ChinaMax.yaml"
    },

    "ChinaMax_Domain": {
      "type": "http",
      "behavior": "domain",
      "format": "mrs",
      "interval": 86400,
      "url": "https://raw.githubusercontent.com/Sydney-Moses/Network-Profiles/refs/heads/main/MRS/ChinaMax_Domain.mrs"
    },

    "ChinaMax_IP": {
      "type": "http",
      "behavior": "ipcidr",
      "format": "mrs",
      "interval": 86400,
      "url": "https://raw.githubusercontent.com/Sydney-Moses/Network-Profiles/refs/heads/main/MRS/ChinaMax_IP.mrs"
    }
  };

  return fixed;
}