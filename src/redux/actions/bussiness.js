import {
  GET_COUNTRIES
} from './types';

export function setCountries(data) {
    return {
      type: GET_COUNTRIES,
      data
    };
}