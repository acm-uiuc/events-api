const authConfig = {
    credentials: {
        tenantID: "c8d9148f-9a59-4db3-827d-42ea0c2b6e2e",
        clientID: "7d1bbd04-55ea-4ff4-b32d-9d63b787eea3"
    },
    metadata: {
        authority: "login.microsoftonline.com",
        discovery: ".well-known/openid-configuration",
        version: "v2.0"
    },
    settings: {
        validateIssuer: true,
        passReqToCallback: true,
        loggingLevel: "info",
        loggingNoPII: true,
    },
    permssions: {
        write: "Events.Write.All"
    }
}

export { authConfig }