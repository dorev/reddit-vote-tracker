"use strict";

export function GetPost(url)
{
    if(UrlIsValid(url))
        return GetPostFromId(GetIdFromUrl(url));
    else
        console.log(`Unsupported post url: ${url}`);
}

const validateUrlRegex = /(http(s?):\/\/)?www\.reddit\.com\/r\/\w+\/comments\/\w+(\/.*)?/i;
export function UrlIsValid (url)
{
    return validateUrlRegex.test(url);
}

const extractIdRegex = /(?<=comments\/)\w+/;
function GetIdFromUrl (url)
{
    let result = extractIdRegex.exec(url);
    return result.length == 0 ? '' : result[0];
}

const api = "https://api.reddit.com/api/";
const post = "info/?id=t3_";
async function GetPostFromId(id)
{
    let response = await fetch(`${api}${post}${id}`);
    if(response.ok)
    {
        let json = await response.json();
        return json.data.children[0].data;
    }
    else
    {
        console.log(`${request.status}: ${request.json()}`);
    }
}
