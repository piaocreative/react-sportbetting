import axios from 'axios'
import config from '../config/config.json'

export async function getwatchlist(token)
{
    return await axios.get(config.apiurl + "api/watchlist/get",{params:{token}})
}

export async function createwatchlist(token,teams)
{
    return await axios.post(config.apiurl + "api/watchlist/create",{teams:teams,token});
}

export async function deletewatchlist(token,id)
{
    return await axios.post(config.apiurl + "api/watchlist/delete",{id,token})
}

export async function setfavourite(token,teams,favourite)
{
    return await axios.post(config.apiurl + "api/watchlist/favourite",{token,teams,favourite})
}

export async function getfavourite(token)
{
    return await axios.get(config.apiurl + "api/watchlist/getfav",{params:{token}})
}