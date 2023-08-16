//Global declarations
let size = {
    height:800,
    width: 1000,
    margin: {x:120,
    y:60}
    }
//tooltip/
let tooltip =  d3.select('body')
.append('div')
tooltip.attr('id','tooltip')
.attr('opacity',0)


let svg = d3.select('body')
    .append('svg')
    .attr('id','svg')
    .attr('height',size.height)
    .attr('width',size.width)
    .attr('viewBox',[0,0,size.width,size.height])
    let description = d3.select('#description')
    .html("Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)")
    
let legend;
    //_________________________________________________________________________________________________________________________________________________________________________

    //URLs
    let edData = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';
    let usData = 'usdata.json'
    
    //_________________________________________________________________________________________________________________________________________________________________________
    //declare arrays
    let nation = [], fips = [], state=[], area=[], degree=[];
    //XMLHttpRequest 
    var xhr = new XMLHttpRequest();
    const method = 'GET';
    xhr.responseType = 'json';
    xhr.open(method,usData,true);
    //onload
    xhr.onload = (usData) =>{
    let data = usData.target.response[0]
    //convert data to geoJSON format
    data = topojson.feature(data,data.objects.counties).features
    //XMLHttpRequest
    var xml = new XMLHttpRequest();
    xml.responseType='json';
    xml.open(method,edData,true);
    //onload within onload
    xml.onload = (edData) => {
    let dataset = edData.target.response
    dataset.forEach((d,i) =>{
    fips.push(d.fips)
    state.push(d.state)
    area.push(d.area_name)
    degree.push(d.bachelorsOrHigher)
    })
    //_________________________________________________________________________________________________________________________________________________________________________
    //Playground
//Draw map & declare colors to go with the map   
let colors = ['white','lightBlue','blue', 'navy']
let cPath = svg
   .selectAll('path')
   .data(data)
   .enter()
   .append('path')
   .attr('d',d3.geoPath())
   .attr('stroke','green')
   .classed('county',true)
   .attr('fill',(d) =>{
    let id = d.id
    let county = dataset.find(item => item.fips === id)
    let percentage = county.bachelorsOrHigher
    return colors[percentage <= 15 ? 0 : percentage <= 30 ? 1 : percentage <= 45 ? 2 : 3]
   })
   .attr('data-fips', (d)=>{
    return d.id
   })
   .attr('data-education', (d,index)=>{
    let id = d.id
    let county = dataset.find(item => item.fips === id)
    let percentage = county.bachelorsOrHigher
    return percentage
   })
   //same d3 selection(cPath): Utilizing event listeners with .on('mouse____',function(item){})
   .on('mouseover',(county,i)=>{
    //get x & y positions from each county
    let countyX = d3.event.pageX
    let countyY = d3.event.pageY
    let id = county.id
    //getting education data by finding an item with the same ID(property in both county/education datasets.)
    let ed = dataset.find(item => item.fips === id)
    //declare your own variables in relation to the education data.
    let state = ed.state, area = ed.area_name, percent = ed.bachelorsOrHigher;
    ///plug in the variables inside html() function
    tooltip
    .attr('visibility','visible')
    .html(`<p>State: ${state}<p/><p>Coutny: ${area}<p/> <p>Degree: ${percent}%<p/>`)
    .attr('style',`left: ${countyX}px;top:${countyY}px`)
    .attr('data-education', percent)
    

    
   })
   .on('mouseout',(county)=>{
    let countyX = d3.event.pageX
    let countyY = d3.event.pageY
    tooltip
    .attr('style',`left: ${countyX}px;top:${countyY}px`)
    .attr("visibility", "hidden")
    .attr('style','opacity:0')
   })
   let paths = document.querySelectorAll('.county')

   //create legends
  let legend = d3.select('body')
     .append('svg')
     .attr('id','legend')
let recData = [0,1,2,3]
let legWidth = legend.node().getBoundingClientRect().width
let legHeight = legend.node().getBoundingClientRect().height
let marg = legWidth/5
let recs =  legend.append('g')
         .selectAll('rect')
         .data(recData)
         .enter()
         .append('rect')
         .classed('recall',true)
         .attr('height', 40)
         .attr('width', marg)
         .attr('y', (d,i)=>(i * (legHeight/recData.length)))
         .attr('x', (d,i)=> (i * (legWidth)/recData.length))
         .attr('fill',(d,i)=>colors[i])
        //  .attr('stroke', 'red')

        legend.append('g')
        .selectAll('text')
        .data(recData)
        .enter()
        .append('text')
        .classed('rectext',true)
        .attr('y', (d,i)=>50+(i * (legHeight/recData.length)))
        .attr('x', (d,i)=> 15+(i * (legWidth)/recData.length))
        .html((d,i) =>{
            return ['<= 15%','<= 30%','<= 45%','> 45%'][i]
        })
        .attr('opacity',0)
        let showText = (element) => {
            return d3.select(element)
            .attr('style',`opacity:1;transform:translate(0,25px);transition:.25s ease;`)
        }
        let hideText = (element) => {
            return d3.select(element)
            .attr('style',`opacity:0;transform:translate(0,0);transition:.5s ease;`)
        }
        let recjava = document.querySelectorAll('.recall')
        let text = document.querySelectorAll('.rectext')
        recjava.forEach((rec,i)=>{
            let rectangle = d3.select(rec)
              .on('mouseover',()=>{
                //test the mouseover event listener
                rectangle.attr('opacity','.85')
                .attr('style',`transition: .3s ease;filter:drop-shadow(0 0 6px ${colors[i]})`)
                //Manipulate text on mouseover 
                showText(text[i])
              })
              .on('mouseout',()=>{
                //test the mouseover event listener
                rectangle.attr('opacity','1')
                .attr('style','transition: .75s ease;filter:none')
                //Manipulate text on mouseout 
                hideText(text[i])
              })
        })
        

      
        

    
    


    //Playground
    // _________________________________________________________________________________________________________________________________________________________________________
    }
    xml.send()
    }
    xhr.send()
    