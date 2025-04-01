import {User} from "../models/userModel";

const countriesRouter = require("express").Router();

async function handleResponse(response: Response): Promise<Response> {
    if (!response.ok) {
        const errorText = await response.text();
        console.error(`Fetch error: ${response.status} ${response.statusText} - ${errorText}`);
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }
    return response;
}

countriesRouter.get("/available-countries", async (req: any, res: any) => {
    try {
        const response = await fetch('https://date.nager.at/api/v3/AvailableCountries').then(handleResponse)
        const countries = await response.json();
        if (!countries?.length) return res.status(404).json({error: "Countries not found"});

        return res.status(200).json({availableCountries: countries});
    } catch (e) {
        return res.status(500).json({error: e})
    }
})

countriesRouter.get('/country-info', async (req: any, res: any) => {
    const {code} = req.query;
    let response
    try {
        if (!code) return res.status(400).json({error: "Provide country code"});

        response = await fetch(`https://date.nager.at/api/v3/CountryInfo/${code}`).then(handleResponse)
        let info = await response.json();

        response = await fetch("https://countriesnow.space/api/v0.1/countries/population").then(handleResponse)
        let populationInfo = await response.json();
        populationInfo = populationInfo.data.filter((obj: any) => obj.country === info.commonName)[0].populationCounts

        response = await fetch("https://countriesnow.space/api/v0.1/countries/flag/images").then(handleResponse)
        let flagInfo = await response.json();
        flagInfo = flagInfo.data.filter((obj: any) => obj.name === info.commonName)[0].flag

        info = {
            ...info,
            populationInfo,
            flagInfo
        }
        return res.status(200).json({countryInfo: info});
    } catch (e) {
        return res.status(500).json({error: e})
    }
})

countriesRouter.post('/users/:userId/calendar/holidays', async (req: any, res: any) => {
    const {countryCode, year, holidays} = req.body;
    const {userId} = req.params;
    try {
        console.log(userId)
        if (!countryCode || !year) return res.status(400).json({error: "Provide country code && year"});

        const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`).then(handleResponse)
        let holidaysInfo = await response.json();

        if (holidays) holidaysInfo = holidaysInfo.filter((obj: any) => holidays.includes(obj.name));

        await User.updateOne({_id: userId}, {$push: {'calendar.holidays': {$each: holidaysInfo}}})
        return res.status(200).send("User Calendar Updated");
    } catch (e) {
        return res.status(500).json({error: e})
    }
})

export default countriesRouter;