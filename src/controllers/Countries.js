/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import { serverError, notFoundError } from '../helpers/errors';
import countries from '../config/countries';

export default class CountriesController {
  static async getCountries(req, res) {
    try {
      const allCountries = [];
      for (const country in countries) {
        allCountries.push(country);
      }

      return res.status(200).send({
        data: allCountries,
        message: 'Countries fetched successfully',
        error: false,
      });
    } catch (err) {
      return serverError(res, err.message);
    }
  }

  static async getStates(req, res) {
    try {
      const { country } = req.params;
      const allStates = [];
      const states = countries[country];

      if (!states) return notFoundError(res, 'Country not found');

      for (const state in countries[country]) {
        allStates.push(state);
      }

      return res.status(200).send({
        data: allStates,
        message: 'States fetched successfully',
        error: false,
      });
    } catch (err) {
      return serverError(res, err.message);
    }
  }

  static async getCommunities(req, res) {
    try {
      const { country, state } = req.params;
      const communities = countries[country][state];

      if (!communities) return notFoundError(res, 'State not found');

      return res.status(200).send({
        data: communities,
        message: 'Communities fetched successfully',
        error: false,
      });
    } catch (err) {
      return serverError(res, err.message);
    }
  }
}
