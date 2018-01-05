const defaultConfig = {
  configs: [],
  index: 0,
  shareOverlan: false,
  localPort: 1080,
  ssrPath: '',
  methods: ['aes-128-cfb', 'aes-192-cfb', 'aes-256-cfb', 'aes-128-cfb8', 'aes-192-cfb8', 'aes-256-cfb8',
    'aes-128-ctr', 'aes-192-ctr', 'aes-256-ctr', 'camellia-128-cfb', 'camellia-192-cfb', 'camellia-256-cfb',
    'bf-cfb', 'rc4', 'rc4-md5', 'rc4-md5-6', 'salsa20', 'chacha20', 'chacha20-ietf'
  ],
  protocols: ['origin', 'verify_deflate', 'verify_sha1', 'auth_sha1_v2',
    'auth_sha1_v4', 'auth_aes128_md5', 'auth_aes128_sha1'
  ],
  obfses: ['plain', 'http_simple', 'http_post', 'ramdom_head', 'tls1.2_ticket_auth']
}

export default defaultConfig
