import {Router} from 'express';
import {TodayTixAPIError, TodayTixAPIRes} from '../types/base';
import {DayOfWeek, Daypart, TodayTixShowtime} from '../types/showtimes';
import {AdmissionType} from '../types/shows';

const getShowtimesWithRushSix200Response: TodayTixAPIRes<TodayTixShowtime[]> = {
  code: 200,
  data: [
    {
      _type: 'Showtime',
      id: 1,
      admissionType: AdmissionType.Timed,
      endDatetime: null,
      endDatetimeEpoch: null,
      endLocalDate: null,
      endLocalTime: null,
      datetime: '2024-02-27T19:00:00.000',
      datetimeEpoch: 1709060400,
      daypart: Daypart.Evening,
      dayOfWeek: DayOfWeek.Tuesday,
      localDate: '2024-02-27',
      localTime: '19:00',
      lotteryTickets: null,
      numDaysOut: 0,
      partTwoDatetime: null,
      partTwoDatetimeEpoch: null,
      providerShowtimeId: null,
      regularTickets: null,
      rushTickets: {
        _type: 'RushTicketsInfo',
        availableAfter: '2024-02-27T09:30:00.000',
        availableAfterEpoch: 1709026200,
        availableUntil: '2024-02-27T16:00:00.000',
        availableUntilEpoch: 1709049600,
        lowPrice: {
          value: 25,
          currency: 'GBP',
          display: '£25',
          displayRounded: '£25'
        },
        maxContiguousSeats: 2,
        maxTickets: 2,
        minTickets: 1,
        quantityAvailable: 6,
        quantityHeld: 0,
        rushBannerText: '£25 Rush tickets'
      }
    }
  ]
};

const getShowtimesWithRushWicked200Response: TodayTixAPIRes<
  TodayTixShowtime[]
> = {
  code: 200,
  data: []
};

const getShowtimesWithRushGuysNDolls200Response: TodayTixAPIRes<
  TodayTixShowtime[]
> = {
  code: 200,
  data: [
    {
      _type: 'Showtime',
      id: 2,
      admissionType: AdmissionType.Timed,
      endDatetime: null,
      endDatetimeEpoch: null,
      endLocalDate: null,
      endLocalTime: null,
      datetime: '2024-02-27T14:00:00.000',
      datetimeEpoch: 1709042400,
      daypart: Daypart.Matinee,
      dayOfWeek: DayOfWeek.Tuesday,
      localDate: '2024-02-27',
      localTime: '14:00',
      lotteryTickets: null,
      numDaysOut: 0,
      partTwoDatetime: null,
      partTwoDatetimeEpoch: null,
      providerShowtimeId: null,
      regularTickets: null,
      rushTickets: {
        _type: 'RushTicketsInfo',
        availableAfter: '2024-02-27T08:00:00.000',
        availableAfterEpoch: 1709020800,
        availableUntil: '2024-02-27T12:30:00.000',
        availableUntilEpoch: 1709037000,
        lowPrice: {
          value: 25,
          currency: 'GBP',
          display: '£25',
          displayRounded: '£25'
        },
        maxContiguousSeats: 2,
        maxTickets: 2,
        minTickets: 1,
        quantityAvailable: 5,
        quantityHeld: 2,
        rushBannerText: '£25 Rush tickets'
      }
    },
    {
      _type: 'Showtime',
      id: 3,
      admissionType: AdmissionType.Timed,
      endDatetime: null,
      endDatetimeEpoch: null,
      endLocalDate: null,
      endLocalTime: null,
      datetime: '2024-02-27T19:30:00.000',
      datetimeEpoch: 1709062200,
      daypart: Daypart.Matinee,
      dayOfWeek: DayOfWeek.Tuesday,
      localDate: '2024-02-27',
      localTime: '19:30',
      lotteryTickets: null,
      numDaysOut: 0,
      partTwoDatetime: null,
      partTwoDatetimeEpoch: null,
      providerShowtimeId: null,
      regularTickets: null,
      rushTickets: {
        _type: 'RushTicketsInfo',
        availableAfter: '2024-02-27T11:00:00.000',
        availableAfterEpoch: 1709031600,
        availableUntil: '2024-02-27T17:30:00.000',
        availableUntilEpoch: 1709055000,
        lowPrice: {
          value: 25,
          currency: 'GBP',
          display: '£25',
          displayRounded: '£25'
        },
        maxContiguousSeats: 2,
        maxTickets: 2,
        minTickets: 1,
        quantityAvailable: 10,
        quantityHeld: 2,
        rushBannerText: '£25 Rush tickets'
      }
    }
  ]
};

const getShowtimesWithRush400Response: TodayTixAPIError = {
  code: 400,
  error: 'InvalidParameter',
  context: {
    parameterName: null,
    internalMessage:
      'Property [id] of class [class com.todaytix.api.v2.validation.GetShowtimesInput] with value [0] is less than minimum value [1]'
  },
  title: 'Error',
  message:
    'Property [id] of class [class com.todaytix.api.v2.validation.GetShowtimesInput] with value [0] is less than minimum value [1]'
};

const getShowtimesWithRushAvailabilityRoute = (router: Router) =>
  router.get<
    '/shows/:showId/showtimes/with_rush_availability',
    {showId: string},
    TodayTixAPIRes<TodayTixShowtime[]> | TodayTixAPIError
  >('/shows/:showId/showtimes/with_rush_availability', (req, res) => {
    if (req.params.showId === '1')
      return res.status(200).json(getShowtimesWithRushSix200Response);

    if (req.params.showId === '2')
      return res.status(200).json(getShowtimesWithRushWicked200Response);

    if (req.params.showId === '3')
      return res.status(200).json(getShowtimesWithRushGuysNDolls200Response);

    return res.status(400).json(getShowtimesWithRush400Response);
  });

export default getShowtimesWithRushAvailabilityRoute;
