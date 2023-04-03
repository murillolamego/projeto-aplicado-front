import axios from "axios";

interface ISignInRequestData {
  email: string;
  password: string;
}

interface ISignInResponse {
  accessToken: string;
  refreshToken: string;
}

export async function signInRequest({
  email,
  password,
}: ISignInRequestData): Promise<ISignInResponse | void> {
  try {
    const {
      data: { accessToken, refreshToken },
    } = await axios.post<ISignInResponse>(
      `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/auth/signin`,
      {
        email,
        password,
      },
    );

    console.log("AAAAA");

    return { accessToken, refreshToken };
  } catch (error) {
    console.log("BBBB");
    console.error(error);
  }
}

export async function refreshRequest(
  token: string,
): Promise<ISignInResponse | void> {
  try {
    const {
      data: { accessToken, refreshToken },
    } = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/auth/refresh`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return { accessToken, refreshToken };
  } catch (error) {
    console.error(error);
  }
}
