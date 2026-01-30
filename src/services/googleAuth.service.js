// import * as WebBrowser from "expo-web-browser";
// import * as Google from "expo-auth-session/providers/google";

// WebBrowser.maybeCompleteAuthSession();

// export const useGoogleAuth = () => {
//     const [request, response, promptAsync] = Google.useAuthRequest({
//         androidClientId: "77275497226-3jukkh5dugm520qbotpm641a8ipiar26.apps.googleusercontent.com",
//         iosClientId: "77275497226-29sdprktl1gapn0loec4otpli28fkhcc.apps.googleusercontent.com",
//         webClientId: "77275497226-k3udb03liq57gur0207dhhbsn0nf3q0g.apps.googleusercontent.com",
//         scopes: ["profile", "email"],
//     });

//     return { request, response, promptAsync };
// };
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId:
      "77275497226-k3udb03liq57gur0207dhhbsn0nf3q0g.apps.googleusercontent.com",
    offlineAccess: true,
    forceCodeForRefreshToken: true,
  });
};

export const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });

    const userInfo = await GoogleSignin.signIn();
    return userInfo;
  } catch (error) {
    console.log("Google Sign-In Error ❌", error);
    throw error;
  }
};

export const signOutGoogle = async () => {
  try {
    await GoogleSignin.signOut();
  } catch (error) {
    console.log(error);
  }
};
//client secret : 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
