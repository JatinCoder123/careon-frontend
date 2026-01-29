import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: "77275497226-3jukkh5dugm520qbotpm641a8ipiar26.apps.googleusercontent.com",
        iosClientId: "77275497226-29sdprktl1gapn0loec4otpli28fkhcc.apps.googleusercontent.com",
        webClientId: "77275497226-6f7rm1i1c9v02eupv2gttgvpe640f1gq.apps.googleusercontent.com",
        scopes: ["profile", "email"],
    });

    return { request, response, promptAsync };
};
