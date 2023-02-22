import { IVenue } from './../model/venue';
import { Request, Response } from 'express'
import { getParent } from '../util/formatPlaces';

export const getLocation = async (req: Request, res: Response) => {


    // main parameters for search request
    const { latitude: lat, longtitude: long } = req.query;

    // optional parameters

    const RADIUS = 1000; // in meters

    const MAX_DISTANCE = 30; // error margin

    if (!long || !lat) return res.status(400).json({ error: 'Invalid longitude or latitude' });


    const searchParams = new URLSearchParams({

        radius: RADIUS.toString(), // radius in meters
        // categories: '17069,17070',
        // query: '',
        ll: `${lat},${long}`,
        // open_now: 'true',
        sort: 'DISTANCE',

    });

    const url = `https://api.foursquare.com/v3/places/search?${searchParams}`;


    const response = await fetch(url, {
        method: "GET",
        headers: {
            Accept: 'application/json',
            Authorization: process.env.FORSQUARE_TOKEN as string,
        }
    });


    type ibody = {
        results: IVenue[];
    }
    const { results }: ibody = await response.json();



    let result: IVenue | undefined = undefined;
    let placesNearby: IVenue[] | undefined = undefined;


    if (!results.length) {
        return res.json({ result: [], placesNearby: [] })
    }


    // if there are places nearby, chose the first one, or its parent
    if (results[0].distance < MAX_DISTANCE) {
        if (results[0].related_places?.parent)
            result = getParent(results[0].related_places?.parent.name, results);
        else result = results[0];

    }

    // show the places nearby 
    const LIMIT = 5;
    placesNearby = results.filter(place => place.fsq_id != result?.fsq_id && place.distance < RADIUS).slice(0, LIMIT);


    res.json({ result, placesNearby })
}
