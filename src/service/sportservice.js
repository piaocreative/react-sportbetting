import axios from 'axios'
import config from '../config/config.json'
export async function getsportsbook()
{
    return await axios.get(config.apiurl + "api/app/sportsbook");
}

export async function getsportslist(token,date,site)
{
    return await axios.get(config.apiurl + "api/events",{params:{token,date,site}});    
}

export async function getsports()
{
    return await axios.get(config.apiurl + "api/app/sports");
}