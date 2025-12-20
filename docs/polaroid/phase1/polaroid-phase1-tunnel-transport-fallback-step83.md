# Polaroid Phase-1 — Step 83 (Tunnel Transport Fallback)

- UTC: 2025-12-20T19:49:13Z
- Runbook: polaroid-mvp/tools/run-polaroid-tunnel.sh
- Protocol forced: http2
- Edge IP version forced: 4
- LIVE_URL: https://showing-packet-futures-streaming.trycloudflare.com/polaroid-mvp/index.html
- HOST: showing-packet-futures-streaming.trycloudflare.com
- PATH: /polaroid-mvp/index.html
- IPV4_CANDIDATES: 104.16.230.132 104.16.231.132
- BEST_IP: 
- BEST_HEALTH_HTTP_CODE: 000
- BEST_INDEX_HTTP_CODE: 000

## Tunnel log tail (last 120 lines)
```
2025-12-20T19:49:06Z INF Thank you for trying Cloudflare Tunnel. Doing so, without a Cloudflare account, is a quick way to experiment and try it out. However, be aware that these account-less Tunnels have no uptime guarantee, are subject to the Cloudflare Online Services Terms of Use (https://www.cloudflare.com/website-terms/), and Cloudflare reserves the right to investigate your use of Tunnels for violations of such terms. If you intend to use Tunnels in production you should use a pre-created named tunnel by following: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps
2025-12-20T19:49:06Z INF Requesting new quick Tunnel on trycloudflare.com...
2025-12-20T19:49:11Z INF +--------------------------------------------------------------------------------------------+
2025-12-20T19:49:11Z INF |  Your quick Tunnel has been created! Visit it at (it may take some time to be reachable):  |
2025-12-20T19:49:11Z INF |  https://showing-packet-futures-streaming.trycloudflare.com                                |
2025-12-20T19:49:11Z INF +--------------------------------------------------------------------------------------------+
2025-12-20T19:49:11Z INF Cannot determine default configuration path. No file [config.yml config.yaml] in [~/.cloudflared ~/.cloudflare-warp ~/cloudflare-warp /etc/cloudflared /usr/local/etc/cloudflared]
2025-12-20T19:49:11Z INF Version 2025.10.0 (Checksum e0afc3e13b69a54b9df6b9652b206d42fa64653369a4a3f0296a33c38182348f)
2025-12-20T19:49:11Z INF GOOS: darwin, GOVersion: go1.25.2, GoArch: amd64
2025-12-20T19:49:11Z INF Settings: map[edge-ip-version:4 ha-connections:1 no-autoupdate:true p:http2 protocol:http2 url:http://127.0.0.1:8088]
2025-12-20T19:49:11Z INF cloudflared will not automatically update if installed by a package manager.
2025-12-20T19:49:11Z INF Generated Connector ID: d2d060af-bb5b-4a8f-a108-5507f22bccb4
2025-12-20T19:49:11Z INF Initial protocol http2
2025-12-20T19:49:11Z INF ICMP proxy will use 192.168.2.103 as source for IPv4
2025-12-20T19:49:11Z INF ICMP proxy will use fe80::18aa:d3f0:3396:e63b in zone en0 as source for IPv6
2025-12-20T19:49:11Z INF Created ICMP proxy listening on 192.168.2.103:0
2025-12-20T19:49:11Z ERR Cannot determine default origin certificate path. No file cert.pem in [~/.cloudflared ~/.cloudflare-warp ~/cloudflare-warp /etc/cloudflared /usr/local/etc/cloudflared]. You need to specify the origin certificate path by specifying the origincert option in the configuration file, or set TUNNEL_ORIGIN_CERT environment variable originCertPath=
2025-12-20T19:49:11Z INF ICMP proxy will use 192.168.2.103 as source for IPv4
2025-12-20T19:49:11Z INF ICMP proxy will use fe80::18aa:d3f0:3396:e63b in zone en0 as source for IPv6
2025-12-20T19:49:11Z INF Starting metrics server on 127.0.0.1:20241/metrics
2025-12-20T19:49:12Z INF Registered tunnel connection connIndex=0 connection=b75d3cf0-e44e-4fb1-9bbd-7f57f7536548 event=0 ip=198.41.192.107 location=txl01 protocol=http2
```
