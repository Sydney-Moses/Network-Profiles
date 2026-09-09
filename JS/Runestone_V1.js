/*
 * 服务分类配置｜标准化 JS 覆写 V1
 *
 * 使用方式：
 * 1. Clash Hako / Mihomo 客户端先解析机场订阅。
 * 2. 本脚本读取解析后的 config.proxies。
 * 3. 机场原有 proxy-groups / rules / dns / tun / proxy-providers 等配置不会继承。
 * 4. 使用本文件内的固定配置。
 * 5. 机场节点对象完整保留，不重新构造节点字段。
 */

function main(config) {
  // 机场订阅解析后的节点，是本脚本唯一的动态节点来源。
  const proxies = Array.isArray(config && config.proxies)
    ? config.proxies
    : [];

  // 以下为固定配置，来源于原《服务分类配置 (1)(1).yml》。
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
  },
  "proxy-groups": [
    {
      "name": "PROXY-Gate",
      "type": "select",
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Final.png",
      "proxies": [
        "🌎 Global-Manual",
        "🗺️ EUR-Manual",
        "🇺🇸 US-Auto",
        "🇸🇬 SG-Auto",
        "🇭🇰 HK-Auto",
        "🇯🇵 JP-Auto",
        "🇹🇼 TW-Auto",
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
      "name": "🌎 Global-Manual",
      "type": "select",
      "include-all": true,
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Global.png"
    },
    {
      "name": "🗺️ EUR-Manual",
      "type": "select",
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Europe_Map.png",
      "proxies": [
        "🇬🇧 UK-Auto",
        "🇩🇪 DE-Auto",
        "🇫🇷 FR-Auto",
        "🇷🇺 RU-Auto"
      ]
    },
    {
      "name": "YouTube",
      "type": "select",
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/YouTube.png",
      "proxies": [
        "🇺🇸 US-Auto",
        "🇸🇬 SG-Auto",
        "🇭🇰 HK-Auto",
        "🇯🇵 JP-Auto",
        "🇹🇼 TW-Auto",
        "🗺️ EUR-Manual",
        "PROXY-Gate",
        "DIRECT"
      ]
    },
    {
      "name": "Netflix",
      "type": "select",
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Netflix.png",
      "proxies": [
        "🇺🇸 US-Auto",
        "🇸🇬 SG-Auto",
        "🇭🇰 HK-Auto",
        "🇯🇵 JP-Auto",
        "🇹🇼 TW-Auto",
        "🗺️ EUR-Manual",
        "PROXY-Gate",
        "DIRECT"
      ]
    },
    {
      "name": "Disney+",
      "type": "select",
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Disney+.png",
      "proxies": [
        "🇺🇸 US-Auto",
        "🇸🇬 SG-Auto",
        "🇭🇰 HK-Auto",
        "🇯🇵 JP-Auto",
        "🇹🇼 TW-Auto",
        "🗺️ EUR-Manual",
        "PROXY-Gate",
        "DIRECT"
      ]
    },
    {
      "name": "Spotify",
      "type": "select",
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Spotify.png",
      "proxies": [
        "🇺🇸 US-Auto",
        "🇸🇬 SG-Auto",
        "🇭🇰 HK-Auto",
        "🇯🇵 JP-Auto",
        "🇹🇼 TW-Auto",
        "🗺️ EUR-Manual",
        "PROXY-Gate",
        "DIRECT"
      ]
    },
    {
      "name": "TikTok",
      "type": "select",
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/TikTok.png",
      "proxies": [
        "🇺🇸 US-Auto",
        "🇸🇬 SG-Auto",
        "🇭🇰 HK-Auto",
        "🇯🇵 JP-Auto",
        "🇹🇼 TW-Auto",
        "🗺️ EUR-Manual",
        "PROXY-Gate",
        "DIRECT"
      ]
    },
    {
      "name": "Twitch",
      "type": "select",
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Twitch.png",
      "proxies": [
        "🇺🇸 US-Auto",
        "🇸🇬 SG-Auto",
        "🇭🇰 HK-Auto",
        "🇯🇵 JP-Auto",
        "🇹🇼 TW-Auto",
        "🗺️ EUR-Manual",
        "PROXY-Gate",
        "DIRECT"
      ]
    },
    {
      "name": "GPT",
      "type": "select",
      "icon": "https://fastly.jsdelivr.net/gh/shindgewongxj/WHATSINStash/icon/openai.png",
      "proxies": [
        "🇺🇸 US-Auto",
        "🇸🇬 SG-Auto",
        "🇭🇰 HK-Auto",
        "🇯🇵 JP-Auto",
        "🇹🇼 TW-Auto",
        "🗺️ EUR-Manual",
        "PROXY-Gate",
        "DIRECT"
      ]
    },
    {
      "name": "Gemini",
      "type": "select",
      "icon": "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/google-gemini.png",
      "proxies": [
        "🇺🇸 US-Auto",
        "🇸🇬 SG-Auto",
        "🇭🇰 HK-Auto",
        "🇯🇵 JP-Auto",
        "🇹🇼 TW-Auto",
        "🗺️ EUR-Manual",
        "PROXY-Gate",
        "DIRECT"
      ]
    },
    {
      "name": "Claude",
      "type": "select",
      "icon": "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/anthropic.png",
      "proxies": [
        "🇺🇸 US-Auto",
        "🇸🇬 SG-Auto",
        "🇭🇰 HK-Auto",
        "🇯🇵 JP-Auto",
        "🇹🇼 TW-Auto",
        "🗺️ EUR-Manual",
        "PROXY-Gate",
        "DIRECT"
      ]
    },
    {
      "name": "Copilot",
      "type": "select",
      "icon": "https://cdn.jsdelivr.net/gh/Hawaiine/Oasisic-Icons@main/icons/Microsoft/Copilot-1.png",
      "proxies": [
        "🇺🇸 US-Auto",
        "🇸🇬 SG-Auto",
        "🇭🇰 HK-Auto",
        "🇯🇵 JP-Auto",
        "🇹🇼 TW-Auto",
        "🗺️ EUR-Manual",
        "PROXY-Gate",
        "DIRECT"
      ]
    },
    {
      "name": "Grok",
      "type": "select",
      "icon": "https://raw.githubusercontent.com/luestr/IconResource/main/App_icon/120px/Grok.png",
      "proxies": [
        "🇺🇸 US-Auto",
        "🇸🇬 SG-Auto",
        "🇭🇰 HK-Auto",
        "🇯🇵 JP-Auto",
        "🇹🇼 TW-Auto",
        "🗺️ EUR-Manual",
        "PROXY-Gate",
        "DIRECT"
      ]
    },
    {
      "name": "Google",
      "type": "select",
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Google.png",
      "proxies": [
        "🇺🇸 US-Auto",
        "🇸🇬 SG-Auto",
        "🇭🇰 HK-Auto",
        "🇯🇵 JP-Auto",
        "🇹🇼 TW-Auto",
        "🗺️ EUR-Manual",
        "PROXY-Gate",
        "DIRECT"
      ]
    },
    {
      "name": "Apple",
      "type": "select",
      "icon": "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Apple_2.png",
      "proxies": [
        "🇺🇸 US-Auto",
        "🇸🇬 SG-Auto",
        "🇭🇰 HK-Auto",
        "🇯🇵 JP-Auto",
        "🇹🇼 TW-Auto",
        "🗺️ EUR-Manual",
        "PROXY-Gate",
        "DIRECT"
      ]
    },
    {
      "name": "X",
      "type": "select",
      "icon": "https://fastly.jsdelivr.net/gh/shindgewongxj/WHATSINStash/icon/x.png",
      "proxies": [
        "🇺🇸 US-Auto",
        "🇸🇬 SG-Auto",
        "🇭🇰 HK-Auto",
        "🇯🇵 JP-Auto",
        "🇹🇼 TW-Auto",
        "🗺️ EUR-Manual",
        "PROXY-Gate",
        "DIRECT"
      ]
    },
    {
      "name": "Facebook",
      "type": "select",
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Facebook.png",
      "proxies": [
        "🇺🇸 US-Auto",
        "🇸🇬 SG-Auto",
        "🇭🇰 HK-Auto",
        "🇯🇵 JP-Auto",
        "🇹🇼 TW-Auto",
        "🗺️ EUR-Manual",
        "PROXY-Gate",
        "DIRECT"
      ]
    },
    {
      "name": "Instagram",
      "type": "select",
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Instagram.png",
      "proxies": [
        "🇺🇸 US-Auto",
        "🇸🇬 SG-Auto",
        "🇭🇰 HK-Auto",
        "🇯🇵 JP-Auto",
        "🇹🇼 TW-Auto",
        "🗺️ EUR-Manual",
        "PROXY-Gate",
        "DIRECT"
      ]
    },
    {
      "name": "WhatsApp",
      "type": "select",
      "icon": "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/whatsapp.png",
      "proxies": [
        "🇺🇸 US-Auto",
        "🇸🇬 SG-Auto",
        "🇭🇰 HK-Auto",
        "🇯🇵 JP-Auto",
        "🇹🇼 TW-Auto",
        "🗺️ EUR-Manual",
        "PROXY-Gate",
        "DIRECT"
      ]
    },
    {
      "name": "Telegram",
      "type": "select",
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Telegram.png",
      "proxies": [
        "🇺🇸 US-Auto",
        "🇸🇬 SG-Auto",
        "🇭🇰 HK-Auto",
        "🇯🇵 JP-Auto",
        "🇹🇼 TW-Auto",
        "🗺️ EUR-Manual",
        "PROXY-Gate",
        "DIRECT"
      ]
    },
    {
      "name": "Github",
      "type": "select",
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/GitHub.png",
      "proxies": [
        "🇺🇸 US-Auto",
        "🇸🇬 SG-Auto",
        "🇭🇰 HK-Auto",
        "🇯🇵 JP-Auto",
        "🇹🇼 TW-Auto",
        "🗺️ EUR-Manual",
        "PROXY-Gate",
        "DIRECT"
      ]
    },
    {
      "name": "Speedtest",
      "type": "select",
      "icon": "https://cdn.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Speedtest.png",
      "proxies": [
        "🇺🇸 US-Auto",
        "🇸🇬 SG-Auto",
        "🇭🇰 HK-Auto",
        "🇯🇵 JP-Auto",
        "🇹🇼 TW-Auto",
        "🗺️ EUR-Manual",
        "PROXY-Gate",
        "DIRECT"
      ]
    },   
    {
      "name": "APNs-Fallback",
      "type": "fallback",
      "proxies": [
        "🇺🇸 US-Auto",
        "🇸🇬 SG-Auto",
        "🇭🇰 HK-Auto",
        "🇯🇵 JP-Auto",
        "🇹🇼 TW-Auto",
        "🇬🇧 UK-Auto",
        "🇩🇪 DE-Auto",
        "🇫🇷 FR-Auto",
        "🇷🇺 RU-Auto"
      ],
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Apple.png",
      "url": "http://captive.apple.com/hotspot-detect.html",
      "interval": 300
    },
    {
      "name": "🇺🇸 US-Auto",
      "type": "url-test",
      "include-all": true,
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/United_States.png",
      "filter": "(?i)(\\[US\\]|^US$|USA|United States|\\bUS\\b|美国)",
      "url": "http://www.gstatic.com/generate_204",
      "interval": 900,
      "tolerance": 50
    },
    {
      "name": "🇸🇬 SG-Auto",
      "type": "url-test",
      "include-all": true,
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Singapore.png",
      "filter": "(?i)(\\[SG\\]|^SG$|Singapore|\\bSG\\b|新加坡|狮城)",
      "url": "http://www.gstatic.com/generate_204",
      "interval": 900,
      "tolerance": 50
    },
    {
      "name": "🇭🇰 HK-Auto",
      "type": "url-test",
      "include-all": true,
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Hong_Kong.png",
      "filter": "(?i)(\\[HK\\]|^HK$|Hong Kong|\\bHK\\b|香港|🇨🇳香港)",
      "url": "http://www.gstatic.com/generate_204",
      "interval": 900,
      "tolerance": 50
    },
    {
      "name": "🇯🇵 JP-Auto",
      "type": "url-test",
      "include-all": true,
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Japan.png",
      "filter": "(?i)(\\[JP\\]|^JP$|Japan|\\bJP\\b|日本|东京|大阪|🇯🇵日本)",
      "url": "http://www.gstatic.com/generate_204",
      "interval": 900,
      "tolerance": 50
    },
    {
      "name": "🇹🇼 TW-Auto",
      "type": "url-test",
      "include-all": true,
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Taiwan.png",
      "filter": "(?i)(\\[TW\\]|^TW$|Taiwan|Taibei|\\bTW\\b|台湾|台北|🇹🇼)",
      "url": "http://www.gstatic.com/generate_204",
      "interval": 900,
      "tolerance": 50
    },
    {
      "name": "🇬🇧 UK-Auto",
      "type": "url-test",
      "include-all": true,
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/United_Kingdom.png",
      "filter": "(?i)(\\[UK\\]|^UK$|UK|United Kingdom|Britain|\\bUK\\b|英国|伦敦)",
      "url": "http://www.gstatic.com/generate_204",
      "interval": 900,
      "tolerance": 50
    },
    {
      "name": "🇩🇪 DE-Auto",
      "type": "url-test",
      "include-all": true,
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Germany.png",
      "filter": "(?i)(\\[DE\\]|^DE$|Germany|Deutschland|\\bDE\\b|德国|法兰克福)",
      "url": "http://www.gstatic.com/generate_204",
      "interval": 900,
      "tolerance": 50
    },
    {
      "name": "🇫🇷 FR-Auto",
      "type": "url-test",
      "include-all": true,
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/France.png",
      "filter": "(?i)(\\[FR\\]|^FR$|France|\\bFR\\b|法国|巴黎)",
      "url": "http://www.gstatic.com/generate_204",
      "interval": 900,
      "tolerance": 50
    },
    {
      "name": "🇷🇺 RU-Auto",
      "type": "url-test",
      "include-all": true,
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Russia.png",
      "filter": "(?i)(\\[RU\\]|^RU$|Russia|Russian Federation|\\bRU\\b|俄罗斯|莫斯科|伯力)",
      "url": "http://www.gstatic.com/generate_204",
      "interval": 900,
      "tolerance": 50
    }
  ],
  "rules": [
    "IP-CIDR,192.168.0.0/16,DIRECT,no-resolve",
    "IP-CIDR,10.0.0.0/8,DIRECT,no-resolve",
    "IP-CIDR,172.16.0.0/12,DIRECT,no-resolve",
    "IP-CIDR,127.0.0.0/8,DIRECT,no-resolve",
    "GEOIP,LAN,DIRECT,no-resolve",

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
  ],
  "rule-providers": {
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
  }
  };

  // 将机场订阅解析后的全部节点注入统一配置。
  fixed.proxies = proxies;

  // 明确删除机场订阅提供器，避免继续依赖机场原配置。
  delete fixed["proxy-providers"];

  return fixed;
}