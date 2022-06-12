import axios from 'axios'
import config from '../config/config.json'

export async function addhistory()
{
    
}

export async function getarticle()
{
    return await axios.get(config.apiurl + "api/article/get")
}

export async function gethistory(token)
{
    return await axios.get(config.apiurl + "api/history/get",{params:{token}});
}