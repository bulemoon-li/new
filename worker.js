// ... existing code ...
export default {
  async fetch(request, env) {
    const html = `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>百度地图Worker版</title>
        <script type="text/javascript" src="https://api.map.baidu.com/api?v=3.0&ak=${env.BAIDU_MAP_AK}"></script>
      </head>
      <body>
        <div id="container"></div>
        <script src="/main.js"></script>
      </body>
    </html>`;
    
    return new Response(html, {
      headers: { 'Content-Type': 'text/html' }
    });
  }
};