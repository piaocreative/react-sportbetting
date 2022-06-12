import axios from 'axios'
import config from '../config/config.json'

export async function getalertparams(token)
{
    return await axios.get(config.apiurl + "api/alert/get",{params:{token}})
}

export async function updatealertparams(alert,token)
{
    return await axios.post(config.apiurl + "api/alert/update",{...alert,token})
}

export async function setalertparams(id)
{
    return await axios.post(config.apiurl + "api/alert/set",{id})
}

export async function deletealert(id,token)
{
    return await axios.post(config.apiurl + "api/alert/delete",{id,token})
}

export async function updatebalance(balance,free,token)
{
    return await axios.post(config.apiurl + "api/user/updatebalance",{balance,free,token})
}