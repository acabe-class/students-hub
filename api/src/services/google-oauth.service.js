import { google } from "googleapis";
import config from "../lib/config.lib.js";

class GoogleOAuthService {
  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      config.getOrThrow("GOOGLE_CLIENT_ID"),
      config.getOrThrow("GOOGLE_CLIENT_SECRET"),
      config.getOrThrow("GOOGLE_REDIRECT_URI")
    );
  }

  getAuthUrl() {
    const scopes = [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    });
  }

  async getTokens(code) {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      this.oauth2Client.setCredentials(tokens);
      return tokens;
    } catch (error) {
      console.error('Error getting tokens:', error);
      throw new Error('Failed to get Google tokens');
    }
  }

  async getUserInfo(accessToken) {
    try {
      this.oauth2Client.setCredentials({ access_token: accessToken });
      const oauth2 = google.oauth2({ version: 'v2', auth: this.oauth2Client });
      
      const { data } = await oauth2.userinfo.get();
      return {
        id: data.id,
        email: data.email,
        name: data.name,
        picture: data.picture,
        given_name: data.given_name,
        family_name: data.family_name
      };
    } catch (error) {
      console.error('Error getting user info:', error);
      throw new Error('Failed to get Google user info');
    }
  }

  async verifyIdToken(idToken) {
    try {
      const ticket = await this.oauth2Client.verifyIdToken({
        idToken,
        audience: config.getOrThrow("GOOGLE_CLIENT_ID")
      });
      
      const payload = ticket.getPayload();
      return {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        email_verified: payload.email_verified
      };
    } catch (error) {
      console.error('Error verifying ID token:', error);
      throw new Error('Invalid Google ID token');
    }
  }
}

export default new GoogleOAuthService(); 