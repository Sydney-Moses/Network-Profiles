const services = {

  YouTube: {
    url: 'https://www.youtube.com/generate_204',
    successCodes: [204],
    icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/YouTube.png'
  },

  Netflix: {
    url: 'https://www.netflix.com/favicon.ico',
    successMin: 200,
    successMax: 399,
    icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Netflix.png'
  },

  'Disney+': {
    url: 'https://www.disneyplus.com/favicon.ico',
    successMin: 200,
    successMax: 399,
    icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Disney+.png'
  },

  Spotify: {
    url: 'https://open.spotify.com/favicon.ico',
    successMin: 200,
    successMax: 399,
    icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Spotify.png'
  },

  TikTok: {
    url: 'https://www.tiktok.com/favicon.ico',
    successMin: 200,
    successMax: 399,
    icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/TikTok.png'
  },

  Twitch: {
    url: 'https://www.twitch.tv/favicon.ico',
    successMin: 200,
    successMax: 399,
    icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Twitch.png'
  },

  GPT: {
    url: 'https://chatgpt.com/favicon.ico',
    successMin: 200,
    successMax: 399,
    icon: 'https://fastly.jsdelivr.net/gh/shindgewongxj/WHATSINStash/icon/openai.png'
  },

  Gemini: {
    url: 'https://gemini.google.com/favicon.ico',
    successMin: 200,
    successMax: 399,
    icon: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/google-gemini.png'
  },

  Claude: {
    url: 'https://claude.ai/favicon.ico',
    successMin: 200,
    successMax: 399,
    icon: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/anthropic.png'
  },

  Copilot: {
    url: 'https://copilot.microsoft.com/favicon.ico',
    successMin: 200,
    successMax: 399,
    icon: 'https://cdn.jsdelivr.net/gh/Hawaiine/Oasisic-Icons@main/icons/Microsoft/Copilot-1.png'
  },

  Grok: {
    url: 'https://grok.com/favicon.ico',
    successMin: 200,
    successMax: 399,
    icon: 'https://raw.githubusercontent.com/luestr/IconResource/main/App_icon/120px/Grok.png'
  },

  Google: {
    url: 'https://www.gstatic.com/generate_204',
    successCodes: [204],
    icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Google.png'
  },

  X: {
    url: 'https://x.com/favicon.ico',
    successMin: 200,
    successMax: 399,
    icon: 'https://fastly.jsdelivr.net/gh/shindgewongxj/WHATSINStash/icon/x.png'
  },

  Facebook: {
    url: 'https://www.facebook.com/favicon.ico',
    successMin: 200,
    successMax: 399,
    icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Facebook.png'
  },

  Instagram: {
    url: 'https://www.instagram.com/favicon.ico',
    successMin: 200,
    successMax: 399,
    icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Instagram.png'
  },

  WhatsApp: {
    url: 'https://www.whatsapp.com/favicon.ico',
    successMin: 200,
    successMax: 399,
    icon: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/whatsapp.png'
  },

  Telegram: {
    url: 'https://web.telegram.org/favicon.ico',
    successMin: 200,
    successMax: 399,
    icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Telegram.png'
  },

  Github: {
    url: 'https://api.github.com/rate_limit',
    successCodes: [200],
    icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/GitHub.png'
  },

  Speedtest: {
    url: 'https://www.speedtest.net/favicon.ico',
    successMin: 200,
    successMax: 399,
    icon: 'https://cdn.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Speedtest.png'
  }

}


const serviceName = String($argument || '').trim()
const service = services[serviceName]


if (!service) {

  console.log(
    '[Third-Party] Unknown service:',
    serviceName
  )

  $done({
    title: serviceName || 'Third-Party',
    content: '配置错误'
  })

} else {

  const startTime = Date.now()

  $httpClient.head(
    {
      url: service.url,

      timeout: 10,

      headers: {
        'User-Agent':
          'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1',

        'X-Stash-Selected-Proxy':
          encodeURIComponent(serviceName)
      }
    },

    (error, response, data) => {

      const elapsed = Date.now() - startTime

      if (error) {

        console.log(
          '[' + serviceName + '] Request Error:',
          error
        )

        const errorText = String(error).toLowerCase()

        if (
          errorText.includes('timeout') ||
          errorText.includes('timed out')
        ) {

          $done({
            title: serviceName,
            content: '超时 · 10.0 s',
            icon: service.icon
          })

        } else {

          $done({
            title: serviceName,
            content: '连接失败',
            icon: service.icon
          })

        }

        return
      }


      if (
        !response ||
        typeof response.status !== 'number'
      ) {

        console.log(
          '[' + serviceName + '] Invalid Response:',
          response
        )

        $done({
          title: serviceName,
          content: '连接失败',
          icon: service.icon
        })

        return
      }


      const status = response.status

      let success = false

      if (service.successCodes) {

        success = service.successCodes.includes(status)

      } else {

        success =
          status >= service.successMin &&
          status <= service.successMax

      }


      if (success) {

        $done({
          title: serviceName,
          content: '可访问 · ' + elapsed + ' ms',
          icon: service.icon
        })

      } else if (status >= 400 && status <= 499) {

        $done({
          title: serviceName,
          content: '受限 · HTTP ' + status + ' · ' + elapsed + ' ms',
          icon: service.icon
        })

      } else if (status >= 500 && status <= 599) {

        $done({
          title: serviceName,
          content: '服务器错误 · ' + status + ' · ' + elapsed + ' ms',
          icon: service.icon
        })

      } else {

        $done({
          title: serviceName,
          content: 'HTTP ' + status + ' · ' + elapsed + ' ms',
          icon: service.icon
        })

      }

    }
  )

}