import { IVenue } from "../model/venue";

export function getParent(name: string, places: IVenue[]): IVenue | undefined {
    return places.find(place => place.name.includes(name) &&
        place.related_places && place.related_places.children.length > 0)
}

