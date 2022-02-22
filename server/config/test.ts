export default {
  port: 3000,
  dbUri: 'mongodb://localhost:27017/rest-api',
  saltWorkFactor: 10,
  accessTokenTtl: '10m',
  refreshTokenTtl: '1d',
  accessTokenPrivateKey: `-----BEGIN RSA PRIVATE KEY-----
MIICXAIBAAKBgGivJSY0grTjYvivECwCLsQkaKId1w8VN4N7zXaQUh5WY69gEwF4
tmL0Co6ni7MQJI0bMB4t6HesXlq7+g9sEX6ZpEenM21Wtdjm/Byi5wezTxwRkFQq
m96jOIRgeFB3N4O/AbtG+0+TICSYGraWZysGBxhJhLBGS7cQSSpgY80pAgMBAAEC
gYAxn80xdjT7wMra7knxQruemU/Mge6/pKQjPR3h9XooDXXF3fpEeU+kSuFyTHRJ
1v4ssdW2iLapfFliE7fvdaA40zEFs5sTPOQT7+pxk6eDSfduT+msVyGGLt2eJi8P
AHjSHqWaqJbMf+mWIONiSta37pBUHVmu8+9kTUctVoEerQJBAKSSsvTAXRuIXVrd
J9tH5nEjVRtD3mmSlJAR/r1934Hv2ejEkcazCigaJM5e9JL+qjEJUMVGW5/dAptZ
zg5BzZMCQQCi1yZruaaVSEGxTD2U5NOS2ojDByYr2Pt+Ff3wEGy5/AmosGZJsfGG
wmmKH2fhK3xt64nAEcPOWofjUUhhzU/TAkEAhLv1LkZAUkaH1RNuZAP3ruSqbdUt
e8THofOBnF/7dxd2j7CLStF4raN4cCJR7IUNy4MR7Cq1F5jv01B5SzJzlQJBAKBN
tODvjfH/g8wKBcWBzlYPE/sKGqWnoUxqUeX2BVLBrrCFluyNY/sJf+QdLqIXsRJ0
gNK3qk6GCKfa6Kp+90kCQAKuz1xjM2a0jKr0BJqVEOQQyuEBvrn5MO4bifSqBQnx
NGKncyqAedxw5JB6qNrASdlIHg4+s3nHbmJzIqkEmdQ=
-----END RSA PRIVATE KEY-----`,
  accessTokenPublicKey: `-----BEGIN PUBLIC KEY-----
MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgGivJSY0grTjYvivECwCLsQkaKId
1w8VN4N7zXaQUh5WY69gEwF4tmL0Co6ni7MQJI0bMB4t6HesXlq7+g9sEX6ZpEen
M21Wtdjm/Byi5wezTxwRkFQqm96jOIRgeFB3N4O/AbtG+0+TICSYGraWZysGBxhJ
hLBGS7cQSSpgY80pAgMBAAE=
-----END PUBLIC KEY-----`,
  refreshTokenPrivateKey: ``,
  refreshTokenPublicKey: ``,
}
