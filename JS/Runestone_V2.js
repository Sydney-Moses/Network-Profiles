function main(config) {
  const currentProxies = Array.isArray(config && config.proxies) ? config.proxies : [];
  const currentProxyNames = currentProxies
    .map(p => typeof p === "string" ? p : (p && typeof p.name === "string" ? p.name : null))
    .filter(Boolean);

  const backupProvider = config && config["proxy-providers"] && config["proxy-providers"]["Backup"];
  const backupProviderProxies = backupProvider && Array.isArray(backupProvider.proxies)
    ? backupProvider.proxies
    : null;

  const backupRegionGroup = (name, icon, filter) => {
    if (backupProviderProxies) {
      const matched = backupProviderProxies
        .map(p => typeof p === "string" ? p : (p && typeof p.name === "string" ? p.name : null))
        .filter(Boolean)
        .filter(proxyName =>
          new RegExp(filter.replace(/^\(\?i\)/, ""), "i").test(proxyName)
        );

      return {
        name,
        type: "url-test",
        proxies: matched,
        icon,
        url: "http://www.gstatic.com/generate_204",
        interval: 900,
        tolerance: 50
      };
    }

    return {
      name,
      type: "url-test",
      use: ["Backup"],
      icon,
      filter,
      url: "http://www.gstatic.com/generate_204",
      interval: 900,
      tolerance: 50
    };
  };

  /*
   * 一号机场：
   * 直接读取 config.proxies。
   * 只有实际匹配到节点时才生成 Auto-1。
   *
   * 二号机场：
   * 继续通过 Backup Provider + filter 生成 Auto-2。
   * 即使没有匹配节点，也保留 Auto-2 空组。
   */
  const currentRegionMatches = {};

  const getCurrentRegionMatches = (key, filter) => {
    const matched = currentProxyNames.filter(name => filter.test(name));
    currentRegionMatches[key] = matched;
    return matched;
  };

  const currentUS = getCurrentRegionMatches(
    "US",
    /(\[US\]|^US$|USA|United[ _-]?States|\bUS\b|美国|美國|🇺🇸)/i
  );

  const currentSG = getCurrentRegionMatches(
    "SG",
    /(\[SG\]|^SG$|Singapore|\bSG\b|新加坡|狮城|🇸🇬)/i
  );

  const currentHK = getCurrentRegionMatches(
    "HK",
    /(\[HK\]|^HK$|Hong[ _-]?Kong|\bHK\b|香港|🇭🇰)/i
  );

  const currentJP = getCurrentRegionMatches(
    "JP",
    /(\[JP\]|^JP$|Japan|\bJP\b|日本|东京|大阪|🇯🇵)/i
  );

  const currentTW = getCurrentRegionMatches(
    "TW",
    /(\[TW\]|^TW$|Taiwan|Taibei|Taipei|\bTW\b|台湾|臺灣|台北|高雄|🇹🇼)/i
  );

  const currentUK = getCurrentRegionMatches(
    "UK",
    /(\[UK\]|^UK$|United[ _-]?Kingdom|Britain|England|\bUK\b|英国|英國|伦敦|🇬🇧)/i
  );

  const currentDE = getCurrentRegionMatches(
    "DE",
    /(\[DE\]|^DE$|Germany|Deutschland|\bDE\b|德国|德國|法兰克福|🇩🇪)/i
  );

  const currentFR = getCurrentRegionMatches(
    "FR",
    /(\[FR\]|^FR$|France|\bFR\b|法国|法國|巴黎|🇫🇷)/i
  );

  const currentRU = getCurrentRegionMatches(
    "RU",
    /(\[RU\]|^RU$|Russia|Russian[ _-]?Federation|\bRU\b|俄罗斯|俄羅斯|莫斯科|伯力|🇷🇺)/i
  );

  const hasCurrentAuto = {
    US: currentUS.length > 0,
    SG: currentSG.length > 0,
    HK: currentHK.length > 0,
    JP: currentJP.length > 0,
    TW: currentTW.length > 0,
    UK: currentUK.length > 0,
    DE: currentDE.length > 0,
    FR: currentFR.length > 0,
    RU: currentRU.length > 0
  };

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

  fixed.proxies = currentProxies;
  fixed["proxy-groups"] = [];

  // 1. Main groups
  fixed["proxy-groups"].push(
    {
      "name": "PROXY-Gate",
      "type": "select",
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Final.png",
      "proxies": [
        "🖥️ All-Nodes-1",
        "🖥️ All-Nodes-2",
        "🗺️ EUR-Manual",
        "🇺🇸 US-Fallback",
        "🇸🇬 SG-Fallback",
        "🇭🇰 HK-Fallback",
        "🇯🇵 JP-Fallback",
        "🇹🇼 TW-Fallback",
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
      "name": "🖥️ All-Nodes-1",
      "type": "select",
      "proxies": currentProxyNames.slice(),
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Server.png"
    },
    {
      "name": "🖥️ All-Nodes-2",
      "type": "select",
      "use": [
        "Backup"
      ],
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Server.png"
    },
    {
      "name": "🗺️ EUR-Manual",
      "type": "select",
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Europe_Map.png",
      "proxies": [
        "🇬🇧 UK-Fallback",
        "🇩🇪 DE-Fallback",
        "🇫🇷 FR-Fallback",
        "🇷🇺 RU-Fallback"
      ]
    }
  );

  fixed["proxy-groups"].push({
    name: "YouTube",
    type: "select",
    icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/YouTube.png",
    proxies: [
      "🖥️ All-Nodes-1",
      "🖥️ All-Nodes-2",
      "🇺🇸 US-Fallback",
      "🇸🇬 SG-Fallback",
      "🇭🇰 HK-Fallback",
      "🇯🇵 JP-Fallback",
      "🇹🇼 TW-Fallback",
      "🗺️ EUR-Manual",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  fixed["proxy-groups"].push({
    name: "Netflix",
    type: "select",
    icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Netflix.png",
    proxies: [
      "🖥️ All-Nodes-1",
      "🖥️ All-Nodes-2",
      "🇺🇸 US-Fallback",
      "🇸🇬 SG-Fallback",
      "🇭🇰 HK-Fallback",
      "🇯🇵 JP-Fallback",
      "🇹🇼 TW-Fallback",
      "🗺️ EUR-Manual",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  fixed["proxy-groups"].push({
    name: "Disney+",
    type: "select",
    icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Disney+.png",
    proxies: [
      "🖥️ All-Nodes-1",
      "🖥️ All-Nodes-2",
      "🇺🇸 US-Fallback",
      "🇸🇬 SG-Fallback",
      "🇭🇰 HK-Fallback",
      "🇯🇵 JP-Fallback",
      "🇹🇼 TW-Fallback",
      "🗺️ EUR-Manual",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  fixed["proxy-groups"].push({
    name: "Spotify",
    type: "select",
    icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Spotify.png",
    proxies: [
      "🖥️ All-Nodes-1",
      "🖥️ All-Nodes-2",
      "🇺🇸 US-Fallback",
      "🇸🇬 SG-Fallback",
      "🇭🇰 HK-Fallback",
      "🇯🇵 JP-Fallback",
      "🇹🇼 TW-Fallback",
      "🗺️ EUR-Manual",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  fixed["proxy-groups"].push({
    name: "TikTok",
    type: "select",
    icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/TikTok.png",
    proxies: [
      "🖥️ All-Nodes-1",
      "🖥️ All-Nodes-2",
      "🇺🇸 US-Fallback",
      "🇸🇬 SG-Fallback",
      "🇭🇰 HK-Fallback",
      "🇯🇵 JP-Fallback",
      "🇹🇼 TW-Fallback",
      "🗺️ EUR-Manual",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  fixed["proxy-groups"].push({
    name: "Twitch",
    type: "select",
    icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Twitch.png",
    proxies: [
      "🖥️ All-Nodes-1",
      "🖥️ All-Nodes-2",
      "🇺🇸 US-Fallback",
      "🇸🇬 SG-Fallback",
      "🇭🇰 HK-Fallback",
      "🇯🇵 JP-Fallback",
      "🇹🇼 TW-Fallback",
      "🗺️ EUR-Manual",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  fixed["proxy-groups"].push({
    name: "GPT",
    type: "select",
    icon: "https://fastly.jsdelivr.net/gh/shindgewongxj/WHATSINStash/icon/openai.png",
    proxies: [
      "🖥️ All-Nodes-1",
      "🖥️ All-Nodes-2",
      "🇺🇸 US-Fallback",
      "🇸🇬 SG-Fallback",
      "🇭🇰 HK-Fallback",
      "🇯🇵 JP-Fallback",
      "🇹🇼 TW-Fallback",
      "🗺️ EUR-Manual",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  fixed["proxy-groups"].push({
    name: "Gemini",
    type: "select",
    icon: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/google-gemini.png",
    proxies: [
      "🖥️ All-Nodes-1",
      "🖥️ All-Nodes-2",
      "🇺🇸 US-Fallback",
      "🇸🇬 SG-Fallback",
      "🇭🇰 HK-Fallback",
      "🇯🇵 JP-Fallback",
      "🇹🇼 TW-Fallback",
      "🗺️ EUR-Manual",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  fixed["proxy-groups"].push({
    name: "Claude",
    type: "select",
    icon: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/anthropic.png",
    proxies: [
      "🖥️ All-Nodes-1",
      "🖥️ All-Nodes-2",
      "🇺🇸 US-Fallback",
      "🇸🇬 SG-Fallback",
      "🇭🇰 HK-Fallback",
      "🇯🇵 JP-Fallback",
      "🇹🇼 TW-Fallback",
      "🗺️ EUR-Manual",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  fixed["proxy-groups"].push({
    name: "Copilot",
    type: "select",
    icon: "https://fastly.jsdelivr.net/gh/Hawaiine/Oasisic-Icons@main/icons/Microsoft/Copilot-1.png",
    proxies: [
      "🖥️ All-Nodes-1",
      "🖥️ All-Nodes-2",
      "🇺🇸 US-Fallback",
      "🇸🇬 SG-Fallback",
      "🇭🇰 HK-Fallback",
      "🇯🇵 JP-Fallback",
      "🇹🇼 TW-Fallback",
      "🗺️ EUR-Manual",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  fixed["proxy-groups"].push({
    name: "Grok",
    type: "select",
    icon: "https://raw.githubusercontent.com/luestr/IconResource/main/App_icon/120px/Grok.png",
    proxies: [
      "🖥️ All-Nodes-1",
      "🖥️ All-Nodes-2",
      "🇺🇸 US-Fallback",
      "🇸🇬 SG-Fallback",
      "🇭🇰 HK-Fallback",
      "🇯🇵 JP-Fallback",
      "🇹🇼 TW-Fallback",
      "🗺️ EUR-Manual",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  fixed["proxy-groups"].push({
    name: "Google",
    type: "select",
    icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Google.png",
    proxies: [
      "🖥️ All-Nodes-1",
      "🖥️ All-Nodes-2",
      "🇺🇸 US-Fallback",
      "🇸🇬 SG-Fallback",
      "🇭🇰 HK-Fallback",
      "🇯🇵 JP-Fallback",
      "🇹🇼 TW-Fallback",
      "🗺️ EUR-Manual",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  // Apple 普通服务策略组
  // 注意：Apple Push / APNs-Fallback 与本组完全隔离。
  fixed["proxy-groups"].push({
    name: "Apple",
    type: "select",
    icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Apple_2.png",
    proxies: [
      "🖥️ All-Nodes-1",
      "🖥️ All-Nodes-2",
      "🇺🇸 US-Fallback",
      "🇸🇬 SG-Fallback",
      "🇭🇰 HK-Fallback",
      "🇯🇵 JP-Fallback",
      "🇹🇼 TW-Fallback",
      "🗺️ EUR-Manual",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  fixed["proxy-groups"].push({
    name: "X",
    type: "select",
    icon: "https://fastly.jsdelivr.net/gh/shindgewongxj/WHATSINStash/icon/x.png",
    proxies: [
      "🖥️ All-Nodes-1",
      "🖥️ All-Nodes-2",
      "🇺🇸 US-Fallback",
      "🇸🇬 SG-Fallback",
      "🇭🇰 HK-Fallback",
      "🇯🇵 JP-Fallback",
      "🇹🇼 TW-Fallback",
      "🗺️ EUR-Manual",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  fixed["proxy-groups"].push({
    name: "Facebook",
    type: "select",
    icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Facebook.png",
    proxies: [
      "🖥️ All-Nodes-1",
      "🖥️ All-Nodes-2",
      "🇺🇸 US-Fallback",
      "🇸🇬 SG-Fallback",
      "🇭🇰 HK-Fallback",
      "🇯🇵 JP-Fallback",
      "🇹🇼 TW-Fallback",
      "🗺️ EUR-Manual",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  fixed["proxy-groups"].push({
    name: "Instagram",
    type: "select",
    icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Instagram.png",
    proxies: [
      "🖥️ All-Nodes-1",
      "🖥️ All-Nodes-2",
      "🇺🇸 US-Fallback",
      "🇸🇬 SG-Fallback",
      "🇭🇰 HK-Fallback",
      "🇯🇵 JP-Fallback",
      "🇹🇼 TW-Fallback",
      "🗺️ EUR-Manual",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  fixed["proxy-groups"].push({
    name: "WhatsApp",
    type: "select",
    icon: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/whatsapp.png",
    proxies: [
      "🖥️ All-Nodes-1",
      "🖥️ All-Nodes-2",
      "🇺🇸 US-Fallback",
      "🇸🇬 SG-Fallback",
      "🇭🇰 HK-Fallback",
      "🇯🇵 JP-Fallback",
      "🇹🇼 TW-Fallback",
      "🗺️ EUR-Manual",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  fixed["proxy-groups"].push({
    name: "Telegram",
    type: "select",
    icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Telegram.png",
    proxies: [
      "🖥️ All-Nodes-1",
      "🖥️ All-Nodes-2",
      "🇺🇸 US-Fallback",
      "🇸🇬 SG-Fallback",
      "🇭🇰 HK-Fallback",
      "🇯🇵 JP-Fallback",
      "🇹🇼 TW-Fallback",
      "🗺️ EUR-Manual",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  fixed["proxy-groups"].push({
    name: "Github",
    type: "select",
    icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/GitHub.png",
    proxies: [
      "🖥️ All-Nodes-1",
      "🖥️ All-Nodes-2",
      "🇺🇸 US-Fallback",
      "🇸🇬 SG-Fallback",
      "🇭🇰 HK-Fallback",
      "🇯🇵 JP-Fallback",
      "🇹🇼 TW-Fallback",
      "🗺️ EUR-Manual",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  fixed["proxy-groups"].push({
    name: "Speedtest",
    type: "select",
    icon: "https://cdn.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Speedtest.png",
    proxies: [
      "🖥️ All-Nodes-1",
      "🖥️ All-Nodes-2",
      "🇺🇸 US-Fallback",
      "🇸🇬 SG-Fallback",
      "🇭🇰 HK-Fallback",
      "🇯🇵 JP-Fallback",
      "🇹🇼 TW-Fallback",
      "🗺️ EUR-Manual",
      "PROXY-Gate",
      "DIRECT"
    ]
  });

  /*
   * 二号机场 Auto-2 依旧始终存在。
   * 一号机场 Auto-1 是否加入 Fallback，由 hasCurrentAuto 决定。
   */
  const fallbackProxies = (region) => {
    const auto1 = {
      US: "🇺🇸 US-Auto-1",
      SG: "🇸🇬 SG-Auto-1",
      HK: "🇭🇰 HK-Auto-1",
      JP: "🇯🇵 JP-Auto-1",
      TW: "🇹🇼 TW-Auto-1",
      UK: "🇬🇧 UK-Auto-1",
      DE: "🇩🇪 DE-Auto-1",
      FR: "🇫🇷 FR-Auto-1",
      RU: "🇷🇺 RU-Auto-1"
    };

    const auto2 = {
      US: "🇺🇸 US-Auto-2",
      SG: "🇸🇬 SG-Auto-2",
      HK: "🇭🇰 HK-Auto-2",
      JP: "🇯🇵 JP-Auto-2",
      TW: "🇹🇼 TW-Auto-2",
      UK: "🇬🇧 UK-Auto-2",
      DE: "🇩🇪 DE-Auto-2",
      FR: "🇫🇷 FR-Auto-2",
      RU: "🇷🇺 RU-Auto-2"
    };

    const result = [];

    if (hasCurrentAuto[region]) {
      result.push(auto1[region]);
    }

    result.push(auto2[region]);

    return result;
  };

  fixed["proxy-groups"].push({
    name: "🇺🇸 US-Fallback",
    type: "fallback",
    proxies: fallbackProxies("US"),
    url: "http://www.gstatic.com/generate_204",
    interval: 900,
    tolerance: 50,
    icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/United_States.png"
  });

  fixed["proxy-groups"].push({
    name: "🇸🇬 SG-Fallback",
    type: "fallback",
    proxies: fallbackProxies("SG"),
    url: "http://www.gstatic.com/generate_204",
    interval: 900,
    tolerance: 50,
    icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Singapore.png"
  });

  fixed["proxy-groups"].push({
    name: "🇭🇰 HK-Fallback",
    type: "fallback",
    proxies: fallbackProxies("HK"),
    url: "http://www.gstatic.com/generate_204",
    interval: 900,
    tolerance: 50,
    icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Hong_Kong.png"
  });

  fixed["proxy-groups"].push({
    name: "🇯🇵 JP-Fallback",
    type: "fallback",
    proxies: fallbackProxies("JP"),
    url: "http://www.gstatic.com/generate_204",
    interval: 900,
    tolerance: 50,
    icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Japan.png"
  });

  fixed["proxy-groups"].push({
    name: "🇹🇼 TW-Fallback",
    type: "fallback",
    proxies: fallbackProxies("TW"),
    url: "http://www.gstatic.com/generate_204",
    interval: 900,
    tolerance: 50,
    icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Taiwan.png"
  });

  fixed["proxy-groups"].push({
    name: "🇬🇧 UK-Fallback",
    type: "fallback",
    proxies: fallbackProxies("UK"),
    url: "http://www.gstatic.com/generate_204",
    interval: 900,
    tolerance: 50,
    icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/United_Kingdom.png"
  });

  fixed["proxy-groups"].push({
    name: "🇩🇪 DE-Fallback",
    type: "fallback",
    proxies: fallbackProxies("DE"),
    url: "http://www.gstatic.com/generate_204",
    interval: 900,
    tolerance: 50,
    icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Germany.png"
  });

  fixed["proxy-groups"].push({
    name: "🇫🇷 FR-Fallback",
    type: "fallback",
    proxies: fallbackProxies("FR"),
    url: "http://www.gstatic.com/generate_204",
    interval: 900,
    tolerance: 50,
    icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/France.png"
  });

  fixed["proxy-groups"].push({
    name: "🇷🇺 RU-Fallback",
    type: "fallback",
    proxies: fallbackProxies("RU"),
    url: "http://www.gstatic.com/generate_204",
    interval: 900,
    tolerance: 50,
    icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Russia.png"
  });

  /*
   * APNs-Fallback：
   * 一号机场只有实际存在的 Auto-1 才加入。
   * 二号机场 Auto-2 全部保留。
   */
  const apnsProxies = [];

  if (hasCurrentAuto.US) apnsProxies.push("🇺🇸 US-Auto-1");
  if (hasCurrentAuto.SG) apnsProxies.push("🇸🇬 SG-Auto-1");
  if (hasCurrentAuto.HK) apnsProxies.push("🇭🇰 HK-Auto-1");
  if (hasCurrentAuto.JP) apnsProxies.push("🇯🇵 JP-Auto-1");
  if (hasCurrentAuto.TW) apnsProxies.push("🇹🇼 TW-Auto-1");
  if (hasCurrentAuto.UK) apnsProxies.push("🇬🇧 UK-Auto-1");
  if (hasCurrentAuto.DE) apnsProxies.push("🇩🇪 DE-Auto-1");
  if (hasCurrentAuto.FR) apnsProxies.push("🇫🇷 FR-Auto-1");
  if (hasCurrentAuto.RU) apnsProxies.push("🇷🇺 RU-Auto-1");

  apnsProxies.push(
    "🇺🇸 US-Auto-2",
    "🇸🇬 SG-Auto-2",
    "🇭🇰 HK-Auto-2",
    "🇯🇵 JP-Auto-2",
    "🇹🇼 TW-Auto-2",
    "🇬🇧 UK-Auto-2",
    "🇩🇪 DE-Auto-2",
    "🇫🇷 FR-Auto-2",
    "🇷🇺 RU-Auto-2"
  );

  fixed["proxy-groups"].push({
    name: "APNs-Fallback",
    type: "fallback",
    proxies: apnsProxies,
    icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Apple.png",
    url: "http://captive.apple.com/hotspot-detect.html",
    interval: 300
  });

  /*
   * 一号机场 Auto-1：
   * 只有存在实际节点时才生成。
   */

  if (currentUS.length > 0) {
    fixed["proxy-groups"].push({
      name: "🇺🇸 US-Auto-1",
      type: "url-test",
      proxies: currentUS,
      icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/United_States.png",
      url: "http://www.gstatic.com/generate_204",
      interval: 900,
      tolerance: 50
    });
  }

  /*
   * 二号机场 Auto-2：
   * 保持原有 Mihomo Provider 机制。
   */
  fixed["proxy-groups"].push(
    backupRegionGroup(
      "🇺🇸 US-Auto-2",
      "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/United_States.png",
      "(?i)(\\[US\\]|^US$|USA|United[ _-]?States|\\bUS\\b|美国|美國|🇺🇸)"
    )
  );

  if (currentSG.length > 0) {
    fixed["proxy-groups"].push({
      name: "🇸🇬 SG-Auto-1",
      type: "url-test",
      proxies: currentSG,
      icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Singapore.png",
      url: "http://www.gstatic.com/generate_204",
      interval: 900,
      tolerance: 50
    });
  }

  fixed["proxy-groups"].push(
    backupRegionGroup(
      "🇸🇬 SG-Auto-2",
      "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Singapore.png",
      "(?i)(\\[SG\\]|^SG$|Singapore|\\bSG\\b|新加坡|狮城|🇸🇬)"
    )
  );

  if (currentHK.length > 0) {
    fixed["proxy-groups"].push({
      name: "🇭🇰 HK-Auto-1",
      type: "url-test",
      proxies: currentHK,
      icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Hong_Kong.png",
      url: "http://www.gstatic.com/generate_204",
      interval: 900,
      tolerance: 50
    });
  }

  fixed["proxy-groups"].push(
    backupRegionGroup(
      "🇭🇰 HK-Auto-2",
      "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Hong_Kong.png",
      "(?i)(\\[HK\\]|^HK$|Hong[ _-]?Kong|\\bHK\\b|香港|🇭🇰)"
    )
  );

  if (currentJP.length > 0) {
    fixed["proxy-groups"].push({
      name: "🇯🇵 JP-Auto-1",
      type: "url-test",
      proxies: currentJP,
      icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Japan.png",
      url: "http://www.gstatic.com/generate_204",
      interval: 900,
      tolerance: 50
    });
  }

  fixed["proxy-groups"].push(
    backupRegionGroup(
      "🇯🇵 JP-Auto-2",
      "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Japan.png",
      "(?i)(\\[JP\\]|^JP$|Japan|\\bJP\\b|日本|东京|大阪|🇯🇵)"
    )
  );

  if (currentTW.length > 0) {
    fixed["proxy-groups"].push({
      name: "🇹🇼 TW-Auto-1",
      type: "url-test",
      proxies: currentTW,
      icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Taiwan.png",
      url: "http://www.gstatic.com/generate_204",
      interval: 900,
      tolerance: 50
    });
  }

  fixed["proxy-groups"].push(
    backupRegionGroup(
      "🇹🇼 TW-Auto-2",
      "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Taiwan.png",
      "(?i)(\\[TW\\]|^TW$|Taiwan|Taibei|Taipei|\\bTW\\b|台湾|臺灣|台北|高雄|🇹🇼)"
    )
  );

  if (currentUK.length > 0) {
    fixed["proxy-groups"].push({
      name: "🇬🇧 UK-Auto-1",
      type: "url-test",
      proxies: currentUK,
      icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/United_Kingdom.png",
      url: "http://www.gstatic.com/generate_204",
      interval: 900,
      tolerance: 50
    });
  }

  fixed["proxy-groups"].push(
    backupRegionGroup(
      "🇬🇧 UK-Auto-2",
      "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/United_Kingdom.png",
      "(?i)(\\[UK\\]|^UK$|United[ _-]?Kingdom|Britain|England|\\bUK\\b|英国|英國|伦敦|🇬🇧)"
    )
  );

  if (currentDE.length > 0) {
    fixed["proxy-groups"].push({
      name: "🇩🇪 DE-Auto-1",
      type: "url-test",
      proxies: currentDE,
      icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Germany.png",
      url: "http://www.gstatic.com/generate_204",
      interval: 900,
      tolerance: 50
    });
  }

  fixed["proxy-groups"].push(
    backupRegionGroup(
      "🇩🇪 DE-Auto-2",
      "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Germany.png",
      "(?i)(\\[DE\\]|^DE$|Germany|Deutschland|\\bDE\\b|德国|德國|法兰克福|🇩🇪)"
    )
  );

  if (currentFR.length > 0) {
    fixed["proxy-groups"].push({
      name: "🇫🇷 FR-Auto-1",
      type: "url-test",
      proxies: currentFR,
      icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/France.png",
      url: "http://www.gstatic.com/generate_204",
      interval: 900,
      tolerance: 50
    });
  }

  fixed["proxy-groups"].push(
    backupRegionGroup(
      "🇫🇷 FR-Auto-2",
      "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/France.png",
      "(?i)(\\[FR\\]|^FR$|France|\\bFR\\b|法国|法國|巴黎|🇫🇷)"
    )
  );

  if (currentRU.length > 0) {
    fixed["proxy-groups"].push({
      name: "🇷🇺 RU-Auto-1",
      type: "url-test",
      proxies: currentRU,
      icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Russia.png",
      url: "http://www.gstatic.com/generate_204",
      interval: 900,
      tolerance: 50
    });
  }

  fixed["proxy-groups"].push(
    backupRegionGroup(
      "🇷🇺 RU-Auto-2",
      "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Russia.png",
      "(?i)(\\[RU\\]|^RU$|Russia|Russian[ _-]?Federation|\\bRU\\b|俄罗斯|俄羅斯|莫斯科|伯力|🇷🇺)"
    )
  );

  fixed.rules = [
    "IP-CIDR,192.168.0.0/16,DIRECT,no-resolve",
    "IP-CIDR,10.0.0.0/8,DIRECT,no-resolve",
    "IP-CIDR,172.16.0.0/12,DIRECT,no-resolve",
    "IP-CIDR,127.0.0.0/8,DIRECT,no-resolve",
    "GEOIP,LAN,DIRECT,no-resolve",

    // Apple Push：必须位于普通 Apple RuleSet 之前。
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

    // Apple 普通服务：独立进入 Apple 策略组。
    "RULE-SET,Apple,Apple",
    "RULE-SET,Apple_Domain,Apple",

    "RULE-SET,AdvertisingLite,REJECT",
    "RULE-SET,AdvertisingLite_Domain,REJECT",
    "RULE-SET,Privacy,REJECT",
    "RULE-SET,Privacy_Domain,REJECT",
    "RULE-SET,ACL4SSR_BanAD,REJECT",
    "RULE-SET,ACL4SSR_BanProgramAD,REJECT",

    "DOMAIN-SUFFIX,youtube.com,YouTube",
    "DOMAIN-SUFFIX,youtu.be,YouTube",
    "DOMAIN-SUFFIX,youtube-nocookie.com,YouTube",
    "DOMAIN-SUFFIX,youtubei.googleapis.com,YouTube",
    "DOMAIN-SUFFIX,youtube.googleapis.com,YouTube",
    "DOMAIN-SUFFIX,ytimg.com,YouTube",
    "DOMAIN-SUFFIX,googlevideo.com,YouTube",
    "DOMAIN-SUFFIX,ggpht.com,YouTube",

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

    "DOMAIN-SUFFIX,disneyplus.com,Disney+",
    "DOMAIN-SUFFIX,disney-plus.net,Disney+",
    "DOMAIN-SUFFIX,dssott.com,Disney+",
    "DOMAIN-SUFFIX,dssedge.com,Disney+",
    "DOMAIN-SUFFIX,bamgrid.com,Disney+",
    "DOMAIN-SUFFIX,media.dssott.com,Disney+",
    "DOMAIN-SUFFIX,disney.playback.edge.bamgrid.com,Disney+",
    "DOMAIN-SUFFIX,star.playback.edge.bamgrid.com,Disney+",
    "DOMAIN-SUFFIX,search-api-disney.bamgrid.com,Disney+",

    "DOMAIN-SUFFIX,spotify.com,Spotify",
    "DOMAIN-SUFFIX,spotifycdn.com,Spotify",
    "DOMAIN-SUFFIX,scdn.co,Spotify",
    "DOMAIN-SUFFIX,spclient.wg.spotify.com,Spotify",
    "DOMAIN-SUFFIX,api-partner.spotify.com,Spotify",
    "DOMAIN-SUFFIX,heads4-ak-spotify-com.akamaized.net,Spotify",
    "DOMAIN-SUFFIX,spotifycdn.com,Spotify",

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

    "DOMAIN-SUFFIX,twitch.tv,Twitch",
    "DOMAIN-SUFFIX,twitchcdn.net,Twitch",
    "DOMAIN-SUFFIX,jtvnw.net,Twitch",
    "DOMAIN-SUFFIX,ttvnw.net,Twitch",
    "DOMAIN-SUFFIX,twitchsvc.net,Twitch",

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

    "DOMAIN-SUFFIX,gemini.google.com,Gemini",
    "DOMAIN-SUFFIX,aistudio.google.com,Gemini",
    "DOMAIN-SUFFIX,deepmind.com,Gemini",
    "DOMAIN-SUFFIX,deepmind.google,Gemini",
    "DOMAIN-SUFFIX,gemini.googleusercontent.com,Gemini",
    "DOMAIN-SUFFIX,makersuite.google.com,Gemini",

    "DOMAIN-SUFFIX,claude.ai,Claude",
    "DOMAIN-SUFFIX,anthropic.com,Claude",
    "DOMAIN-SUFFIX,claudeusercontent.com,Claude",
    "DOMAIN-SUFFIX,claudeusercontent.com.cdn.cloudflare.net,Claude",

    "DOMAIN-SUFFIX,copilot.microsoft.com,Copilot",
    "DOMAIN-SUFFIX,ai.microsoft.com,Copilot",
    "DOMAIN-SUFFIX,designer.microsoft.com,Copilot",
    "DOMAIN-SUFFIX,copilot.com,Copilot",
    "DOMAIN-KEYWORD,copilot,Copilot",

    "DOMAIN-SUFFIX,grok.com,Grok",
    "DOMAIN-SUFFIX,x.ai,Grok",
    "DOMAIN-KEYWORD,grok,Grok",

    "DOMAIN-KEYWORD,google,Google",
    "DOMAIN-SUFFIX,gmail.com,Google",
    "DOMAIN-SUFFIX,googleusercontent.com,Google",
    "DOMAIN-SUFFIX,gstatic.com,Google",
    "DOMAIN-SUFFIX,googleapis.com,Google",
    "DOMAIN-SUFFIX,googleusercontent.com,Google",

    "DOMAIN-SUFFIX,x.com,X",
    "DOMAIN-SUFFIX,twitter.com,X",
    "DOMAIN-SUFFIX,t.co,X",
    "DOMAIN-SUFFIX,twimg.com,X",

    "DOMAIN-SUFFIX,facebook.com,Facebook",
    "DOMAIN-SUFFIX,facebook.net,Facebook",
    "DOMAIN-SUFFIX,fbcdn.net,Facebook",
    "DOMAIN-SUFFIX,fbsbx.com,Facebook",
    "DOMAIN-SUFFIX,fb.com,Facebook",

    "DOMAIN-SUFFIX,instagram.com,Instagram",
    "DOMAIN-SUFFIX,cdninstagram.com,Instagram",
    "DOMAIN-SUFFIX,instagram.net,Instagram",

    "DOMAIN-SUFFIX,whatsapp.com,WhatsApp",
    "DOMAIN-SUFFIX,whatsapp.net,WhatsApp",
    "DOMAIN-SUFFIX,wa.me,WhatsApp",
    "DOMAIN-SUFFIX,whatsapp.org,WhatsApp",

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

    "DOMAIN-SUFFIX,github.com,Github",
    "DOMAIN-SUFFIX,githubusercontent.com,Github",
    "DOMAIN-SUFFIX,githubassets.com,Github",
    "DOMAIN-SUFFIX,raw.githubusercontent.com,Github",
    "DOMAIN-SUFFIX,github.io,Github",
    "DOMAIN-SUFFIX,github.dev,Github",
    "DOMAIN-SUFFIX,githubstatus.com,Github",

    "DOMAIN-SUFFIX,speedtest.net,Speedtest",
    "DOMAIN-SUFFIX,speedtest.com,Speedtest",
    "DOMAIN-SUFFIX,ookla.com,Speedtest",
    "DOMAIN-SUFFIX,ooklaserver.net,Speedtest",
    "DOMAIN-SUFFIX,ookla.net,Speedtest",
    "DOMAIN-SUFFIX,speedtestcustom.com,Speedtest",

    "RULE-SET,ChinaMax,DIRECT",
    "RULE-SET,ChinaMax_Domain,DIRECT",
    "RULE-SET,ChinaMax_IP,DIRECT",
    "GEOSITE,CN,DIRECT",
    "GEOIP,CN,DIRECT,no-resolve",
    "MATCH,PROXY-Gate"
  ];

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

  delete fixed["proxy-providers"];
  return fixed;
}