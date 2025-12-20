# Polaroid Phase-1 — Tunnel 530 Diagnostics (Step 83)

- UTC: 2025-12-20T14:27:43Z
- LIVE_URL: https://mental-wheel-supporting-locator.trycloudflare.com/polaroid-mvp/index.html
- HOST: mental-wheel-supporting-locator.trycloudflare.com
- PATH: /polaroid-mvp/index.html
- Local origin health: 200
- Tunnel PID (best-effort): 98400

## Forced --resolve results

- 104.16.230.132 => HTTP 404
- 104.16.231.132 => HTTP 404
- Hostname fetch => HTTP 404

## Headers (forced resolve: 104.16.230.132)
```
HTTP/1.1 404 Not Found
Date: Sat, 20 Dec 2025 14:27:44 GMT
Content-Type: application/json; charset=utf-8
Transfer-Encoding: chunked
Connection: keep-alive
Server: cloudflare
CF-Ray: 9b0fd2778c40710d-PRG
CF-Cache-Status: DYNAMIC
Cache-Control: no-store

```

## Body snippet (forced resolve: 104.16.230.132)
```
{"ok":false,"error":"not found"}```

## Headers (forced resolve: 104.16.231.132)
```
HTTP/1.1 404 Not Found
Date: Sat, 20 Dec 2025 14:27:44 GMT
Content-Type: application/json; charset=utf-8
Transfer-Encoding: chunked
Connection: keep-alive
Server: cloudflare
CF-Ray: 9b0fd27a0df223fa-PRG
CF-Cache-Status: DYNAMIC
Cache-Control: no-store

```

## Body snippet (forced resolve: 104.16.231.132)
```
{"ok":false,"error":"not found"}```

## Tunnel log tail (last 140 lines)
```
2025-12-20T14:22:29Z INF Thank you for trying Cloudflare Tunnel. Doing so, without a Cloudflare account, is a quick way to experiment and try it out. However, be aware that these account-less Tunnels have no uptime guarantee, are subject to the Cloudflare Online Services Terms of Use (https://www.cloudflare.com/website-terms/), and Cloudflare reserves the right to investigate your use of Tunnels for violations of such terms. If you intend to use Tunnels in production you should use a pre-created named tunnel by following: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps
2025-12-20T14:22:29Z INF Requesting new quick Tunnel on trycloudflare.com...
2025-12-20T14:22:34Z INF +--------------------------------------------------------------------------------------------+
2025-12-20T14:22:34Z INF |  Your quick Tunnel has been created! Visit it at (it may take some time to be reachable):  |
2025-12-20T14:22:34Z INF |  https://mental-wheel-supporting-locator.trycloudflare.com                                 |
2025-12-20T14:22:34Z INF +--------------------------------------------------------------------------------------------+
2025-12-20T14:22:34Z INF Cannot determine default configuration path. No file [config.yml config.yaml] in [~/.cloudflared ~/.cloudflare-warp ~/cloudflare-warp /etc/cloudflared /usr/local/etc/cloudflared]
2025-12-20T14:22:34Z INF Version 2025.10.0 (Checksum e0afc3e13b69a54b9df6b9652b206d42fa64653369a4a3f0296a33c38182348f)
2025-12-20T14:22:34Z INF GOOS: darwin, GOVersion: go1.25.2, GoArch: amd64
2025-12-20T14:22:34Z INF Settings: map[ha-connections:1 no-autoupdate:true p:quic protocol:quic url:http://127.0.0.1:8088]
2025-12-20T14:22:34Z INF cloudflared will not automatically update if installed by a package manager.
2025-12-20T14:22:34Z INF Generated Connector ID: bb9bbe72-02b5-4194-ade9-3e4b2ca58873
2025-12-20T14:22:34Z INF Initial protocol quic
2025-12-20T14:22:34Z INF ICMP proxy will use 192.168.2.103 as source for IPv4
2025-12-20T14:22:34Z INF ICMP proxy will use fe80::18aa:d3f0:3396:e63b in zone en0 as source for IPv6
2025-12-20T14:22:34Z INF Created ICMP proxy listening on 192.168.2.103:0
2025-12-20T14:22:34Z ERR Cannot determine default origin certificate path. No file cert.pem in [~/.cloudflared ~/.cloudflare-warp ~/cloudflare-warp /etc/cloudflared /usr/local/etc/cloudflared]. You need to specify the origin certificate path by specifying the origincert option in the configuration file, or set TUNNEL_ORIGIN_CERT environment variable originCertPath=
2025-12-20T14:22:34Z INF ICMP proxy will use 192.168.2.103 as source for IPv4
2025-12-20T14:22:34Z INF ICMP proxy will use fe80::18aa:d3f0:3396:e63b in zone en0 as source for IPv6
2025-12-20T14:22:34Z INF Starting metrics server on 127.0.0.1:20241/metrics
2025-12-20T14:22:34Z INF Tunnel connection curve preferences: [X25519MLKEM768 CurveP256] connIndex=0 event=0 ip=198.41.192.227
2025-12-20T14:22:35Z INF Registered tunnel connection connIndex=0 connection=4ade88c5-b106-43f2-83f9-7ef8fc804d94 event=0 ip=198.41.192.227 location=txl01 protocol=quic
2025-12-20T14:27:39Z ERR Failed to refresh DNS local resolver error="lookup region1.v2.argotunnel.com: i/o timeout"
```
