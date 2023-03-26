import axios from 'axios';
import * as qs from 'qs';

const TOKEN_URL = "https://login.microsoftonline.com/c8d9148f-9a59-4db3-827d-42ea0c2b6e2e/oauth2/v2.0/token";
const MEMBERS_URL = "https://graph.microsoft.com/v1.0/groups/172fd9ee-69f0-4384-9786-41ff1a43cf8e/members/microsoft.graph.user"

type Token = {
  expires_in: number; // In seconds
  access_token: string; // Access token
};

export class GraphAPI {
  /** @private */
  private clientId: string;
  /** @private */
  private clientSecret: string;
  /** @private */
  private token: Token;
  /** @private */
  private activationTime: number;
 
  /**
   * @constructor
   * @param client -- Azure Graph API Client ID.
   * @param secret -- Azure Graph API Client Secret.
   */
  constructor(client: string, secret: string) {
    this.clientId = client;
    this.clientSecret = secret;
    // We do not create a new token in the constructor as for Axios request calls, we need to use async and await for better keeping track
    // And TypeScript constructors do not support async/await.
    this.token = {access_token: "", expires_in: 0};
    this.activationTime = new Date().getTime();
  }

  /**
   * This creates a new access token, and then sets the token member variable's `access_token` and token expiry time to the gathered token.
   * 
   * @this {GraphAPI}
   */
  async createNewToken() {
    var data = qs.stringify({
      'grant_type': 'client_credentials',
      'client_id': this.clientId,
      'scope': 'https://graph.microsoft.com/.default',
      'client_secret': this.clientSecret
    });

    var config = {
      method: 'post',
    maxBodyLength: Infinity,
      url: TOKEN_URL,
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded', 
        'Cookie': 'fpc=AsUy_e9y-_NJl78_lG1B0fFKX7MIAQAAAJToodsOAAAA; stsservicecookie=estsfd; x-ms-gateway-slice=estsfd'
      },
      data : data
    };
    

    let access_token = "";
    let token_expires_in = 0;
    await axios(config)
    .then(function (response) {
      access_token = response.data.access_token;
      token_expires_in = response.data.expires_in;
    });
    this.activationTime = new Date().getTime();
    this.token.access_token = access_token;
    this.token.expires_in = token_expires_in;
  }

  /**
   * Checks whether organizer is found in the AAD, and returns whether or not it is.
   * 
   * @this {GraphAPI}
   * @param {string} netID: The UIUC Network ID of the organizer to see if the event organizer is a member
   * @returns {Record<string, string>} An object containing the NetID and whether or not the organizer is found 
   */
  async isPaidMember(netID: string) : Promise<Object> {
    let timeDiff = new Date().getTime() - this.activationTime;
    if (this.token.expires_in == 0 || this.token.access_token == "" || timeDiff > this.token.expires_in) {
      // Reset access token if expired or not available
      await this.createNewToken();
    }

    var config = {
      method: 'get',
    maxBodyLength: Infinity,
      url: `${MEMBERS_URL}?$search="userPrincipalName:${netID}"`,
      headers: { 
        'Authorization': `Bearer ${this.token.access_token}`, 
        'Content-type': 'application/json', 
        'ConsistencyLevel': 'eventual'
      }
    };

    let found_data = {netID: netID, isPaidMember: false};

    await axios(config)
    .then(function (response) {
      for (let i = 0; i < response.data.value.length; i++) {
        let userPrincipalName = netID + "_illinois.edu#EXT#@acmillinois.onmicrosoft.com";
        if (response.data.value[i].userPrincipalName == userPrincipalName) {
          found_data.isPaidMember = true;
          break;
        }
      }
    })
    .catch(function (error) {
      found_data.isPaidMember = false; // this should already be true, but just forcing it.
    });

    return found_data;

  }
  
}
