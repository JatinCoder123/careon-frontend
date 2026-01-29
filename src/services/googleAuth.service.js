import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
WebBrowser.maybeCompleteAuthSession();
const redirectUri = AuthSession.makeRedirectUri({
  scheme: "careon",
  path: "redirect",
});
export const useGoogleAuth = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "77275497226-3jukkh5dugm520qbotpm641a8ipiar26.apps.googleusercontent.com",
    iosClientId:
      "77275497226-29sdprktl1gapn0loec4otpli28fkhcc.apps.googleusercontent.com",
    webClientId:
      "77275497226-k3udb03liq57gur0207dhhbsn0nf3q0g.apps.googleusercontent.com",
    scopes: ["profile", "email"],
    // redirectUri,
  });

  return { request, response, promptAsync };
};
//client secret : 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
