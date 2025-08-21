// 部署在 cloudflare 的 Worker，网站前端不使用此代码
// curl -X GET 'https://pv.bxq.me?site=localhost&page=abcde'
// curl -X GET 'https://pv.bxq.me?site=localhost&page=abcde&mode=query'
// curl -X POST 'https://pv.bxq.me?site=localhost' -H 'X-Auth-Key: DEFAULT_SECURE_KEY'
export default {
  async fetch(request, env) {
    // 跨域配置（支持GET/DELETE/OPTIONS）
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Key'
    };

    // 处理预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const site = url.searchParams.get('site');
    const pageHash = url.searchParams.get('page');
    const authKey = request.headers.get('X-Auth-Key'); // 认证密钥

    // 生产环境应从环境变量读取密钥（示例值）
    const validAuthKey = env.AUTH_KEY || "DEFAULT_SECURE_KEY";

    // ================= 清除数据API（DELETE方法）================= [1,6](@ref)
    if (request.method === 'POST') {
      // 1. 基础参数验证
      if (!site) {
        return new Response('Missing site parameter', {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
        });
      }

      // 2. 认证验证
      if (authKey !== validAuthKey) {
        console.warn(`非法清除请求: ${site} from IP: ${request.headers.get('CF-Connecting-IP')}`);
        return new Response('Unauthorized', {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
        });
      }

      try {
        const siteKey = `site:${site}`;
        
        // 3. 执行清除操作
        await env.WEB_PAGE_VIEWS.delete(siteKey);
        console.log(`站点数据已清除: ${site}`);
        
        // 4. 返回成功响应
        return new Response(JSON.stringify({ 
          status: 'success',
          message: `Data for ${site} cleared`
        }), {
          status: 200,
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json'
          }
        });
        
      } catch (error) {
        console.error('清除操作失败:', error);
        return new Response(JSON.stringify({ 
          error: "Server error during cleanup"
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // ================= 原有计数API（GET方法）================= 
    if (request.method === 'GET') {
      // 1. 参数校验
      if (!site || !pageHash || !/^[a-f0-9]{5}$/.test(pageHash)) {
        return new Response('Invalid site or hash format', {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
        });
      }
    
      const mode = url.searchParams.get('mode'); // query 或 空
    
      try {
        // 2. 获取站点数据
        const siteKey = `site:${site}`;
        let siteData = {};
        const storedData = await env.WEB_PAGE_VIEWS.get(siteKey);
        if (storedData) siteData = JSON.parse(storedData);
    
        // 3. 根据 mode 判断是否自增
        if (mode !== 'query') {
          siteData[pageHash] = (siteData[pageHash] || 0) + 1;
          // 保存数据
          await env.WEB_PAGE_VIEWS.put(siteKey, JSON.stringify(siteData));
        }
    
        // 4. 返回当前计数
        return new Response(JSON.stringify({ 
          views: siteData[pageHash] || 0
        }), {
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, max-age=0'
          }
        });
    
      } catch (error) {
        console.error('计数处理错误:', error);
        return new Response(JSON.stringify({ error: "Server error" }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // 不支持的请求方法
    return new Response('Method Not Allowed', { 
      status: 405, 
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' } 
    });
  }
};
