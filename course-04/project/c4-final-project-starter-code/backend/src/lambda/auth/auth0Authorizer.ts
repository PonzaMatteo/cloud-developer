import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify, decode } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')

// DONE: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
// const jwksUrl = 'https://dev-vgb1aim9.us.auth0.com/.well-known/jwks.json'

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  const jwt: Jwt = decode(token, { complete: true }) as Jwt
  verify(token, certificate, {algorithms: ['RS256']})
  // DONE: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  return Promise.resolve(jwt.payload)
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}

const certificate = `
-----BEGIN CERTIFICATE-----
MIIDDTCCAfWgAwIBAgIJHuIQ0d0xpGRZMA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV
BAMTGWRldi12Z2IxYWltOS51cy5hdXRoMC5jb20wHhcNMjEwOTMwMjIxMzQ5WhcN
MzUwNjA5MjIxMzQ5WjAkMSIwIAYDVQQDExlkZXYtdmdiMWFpbTkudXMuYXV0aDAu
Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5WC8rMp5QAbMkLxC
R6UVLhh9+y2FVhM1E/vV/BD7pz+FqUo9q1rwKYw0BGdplFlYRo2yPkusx3A/EFha
L4NCyZ/2LdzfybVctTuBqGqRpi7pWEw6RexjBwB0se7U4EY6SOm7PRu+r5ahJzt7
jllreoDKXkOd8BPVsS+rHTYMbLk45C0j7g76b8ngsymysJMN+QclYf8yN1Ou8krJ
CB7y0Ut+EF72nGCHRLSTwwwC3rNrnJYM1w7iZBQuV0UmDMi6gYooFGFJYecYERIq
sW3R26xI7vECc3ZeYXlY/0zirN70WLg7aUI8h0lACq7fB1BGSpmrUUBRIE7dVZIp
r4WLHQIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBQLqrv5XmDv
jhTBTufuIteO1FckYDAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB
AHCEx5shUpxFjskhJrRDRgNDDdRF5TeHIXMIW1wYZ4qODEO/iRDgQEOrKMXoMiI5
q7whm8IyKrVrc2uHtxuuHJ2iG0SbDcT2e5pSktPy5td+dkyNOGcsJojpOQaLF8P3
3aRxAYpIGItPEaRW1UQdHrQMeudcbsq5lbBdFBpsAieSPs/toNFsy2VhyZaOddb5
tuch1jg7vUG6M9BLa1c1dmyRs6DSnh3pXSsDkgzNMOEVpJJoIp3Uc3Yjg/KJxIGB
Z42jwxxVyDPi34w+48WuFoaAit70gvMmdH6flHeUoctV8F4NyQklCCbbXHQM5Utb
fH+96jtFI73rKul/Ig7hr+s=
-----END CERTIFICATE-----`