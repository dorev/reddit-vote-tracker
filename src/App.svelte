<script>
import { max, extent, scaleLinear, scaleTime, line, curveNatural } from "d3";
import Axis from "./Axis.svelte";
import * as reddit from "./reddit.js";

export let dataset = [];
export let postUrl = "https://www.reddit.com/r/wallstreetbets/comments/msblc3/gme_yolo_update_apr_16_2021_final_update/";
export let period = 1;
export let postTitle = "";
export let postScore = "";
let previousUrl = postUrl;

// Work work
let timer;
let work = () =>
{
    if(postUrl != previousUrl)
    {
        previousUrl = postUrl
        dataset = [];
    }

    if(reddit.UrlIsValid(postUrl))
    {
        reddit.GetPost(postUrl)
        .then( post => 
        {
            if(post != undefined)
            {
                postTitle = post.title;
                postScore = post.score;
                dataset = [...dataset, {x: new Date(Date.now()), y: post.score}];
            }
        })
        .catch(e => console.log(e));
    }
    else
    {
        postTitle = "Invalid post url ¯\\_(ツ)_/¯";
        postScore = 741;
        dataset = [...dataset, {x: new Date(Date.now()), y: postScore}];
    }

    timer = setTimeout(work, period * 1000);
}
work();

// Plot
const margin =
{
    top: 15,
    bottom: 50,
    left: 50,
    right: 20
};
const width  = 400;
const height = 300;
const innerHeight = height - margin.top  - margin.bottom;
const innerWidth  = width  - margin.left - margin.right;

$: xScale = scaleTime()
    .domain(extent(dataset, d => d.x))
    .range([0, innerWidth])
    .nice();

$: yScale = scaleLinear()
    .domain([0, max(dataset, d => d.y)])
    .range([innerHeight, 0])
    .nice();

$: line_gen = line()
    .curve(curveNatural)
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y))(dataset);
</script>

<style>
    path
    {
        fill: transparent;
        stroke: rgb(18, 153, 90);
    }
    div
    {
        border: 2px solid lightblue;
        text-align: center;
    }
    .content
    {
        max-width: 500px;
        margin: auto;
    }
</style>

<div class="content">
    <input bind:value={postUrl}><br/>
    <input type=range bind:value={period} min=1 max=5><br/>
    <h2>{postTitle}</h2><br/>
    <h1>{postScore}</h1><br/>
    <svg {width} {height}>
        <g transform={`translate(${margin.left},${margin.top})`}>
            <Axis {innerHeight} {margin} scale={xScale} position="bottom" />
            <Axis {innerHeight} {margin} scale={yScale} position="left" />
            <path d={line_gen} />
            {#each dataset as data, i}
            <circle
            cx={xScale(data.x)}
            cy={yScale(data.y)}
            r="2"
            />
            {/each}
        </g>
    </svg>
</div>



    