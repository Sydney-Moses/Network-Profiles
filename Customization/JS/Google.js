const proxy = 'Google'

const startTime = Date.now()

$httpClient.get(
  {
    url: 'https://www.gstatic.com/generate_204',
    headers: {
      'X-Stash-Selected-Proxy': encodeURIComponent(proxy)
    },
    timeout: 5
  },
  (error, response, data) => {

    const elapsed = Date.now() - startTime

    if (error) {
      $done({
        title: 'Google',
        content: '不可用 · ' + String(error),
        icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Google.png'
      })
      return
    }

    if (response.status === 204) {
      $done({
        title: 'Google',
        content: '可访问 · ' + elapsed + ' ms',
        icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Google.png'
      })
      return
    }

    $done({
      title: 'Google',
      content: '异常 · HTTP ' + response.status + ' · ' + elapsed + ' ms',
      icon: 'https://fastly.jsdelivr.net/gh/Koolson/Qure/IconSet/Color/Google.png'
    })
  }
)