// This interface provides typings for the decoded Azure AD JWT

export default interface AADTokenInfo {
    aud?: string, 
    iss?: string, 
    iat?: number, 
    nbf?: number,
    exp?: number,
    aio?: string,
    azp?: string,
    azpacr?: string,
    idp?: string,
    name?: string,
    oid?: string, 
    preferred_username?: string,
    rh?: string, 
    scp?: string,
    sub?: string,
    tid?: string,
    uti?: string,
    ver?: string
}