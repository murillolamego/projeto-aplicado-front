import axios from "axios";

const API_URL = "https://countriesnow.space/api/v0.1";

export interface ICountry {
  states: [];
  name: string;
  iso2: string;
  iso3: string;
}

export interface IState {
  name: string;
  state_code: string;
}

export async function getCountriesAndStates() {
  try {
    const { data } = await axios.get(`${API_URL}/countries/states`);

    return data.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getCitiesByCountry(country: string) {
  try {
    const { data } = await axios.get(
      `${API_URL}/countries/cities/q?country=${country.toLowerCase()}`,
    );
    return data.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getCitiesByCountryAndState(
  country: string,
  state: string,
) {
  try {
    const { data } = await axios.get(
      `${API_URL}/countries/state/cities/q?country=${country}&state=${state}`,
    );
    return data.data;
  } catch (error) {
    console.error(error);
  }
}

// https://countriesnow.space/api/v0.1/countries/cities
