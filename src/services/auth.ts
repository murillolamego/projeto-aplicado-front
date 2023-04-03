import axios from "axios";

interface ISignInRequestData {
  email: string;
  password: string;
}
export async function signInRequest({ email, password }: ISignInRequestData) {
  try {
    const response = await axios.post(`${process.env.SERVER_ADDRESS}/signin`, {
      email,
      password,
    });
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}
