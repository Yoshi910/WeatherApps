let w;
let tempMode = 0;//initial temp mode -> Cercius
let fsG = 10;//font size of the guide
let fsF = 7;//font size of the fill
let mesh = 12;//interval of the guide
let moveYPosition1 = -80;
let moveYPosition2 = -30;

// declare variables for the fonts to be used later
let font1;//center
let font2;//others

// setup() will only be called once everything inside preload() has finished loading
function preload() {
  // find your own fonts at https://fonts.google.com/
  font1 = loadFont("data/Play-Regular.ttf");
  font2 = loadFont("data/DMSans-Regular.ttf");
}

function setup() {
createCanvas(414, 736); // use the size of your phone
textAlign(CENTER,CENTER);
angleMode(DEGREES);
// get the current weather for MIT's latitude and longitude
// w = requestWeather(42.3596764, -71.0958358);
w = requestWeather('gps');

}


function draw() {
background(0,0,0); 

if(w.ready){
let when = w.getTimeMoment();
let hr = hour();
let mn = minute();
let summary = w.getSummary();
push();
translate(0,moveYPosition1+10);
fill(255,255,255);
textSize(30);
textFont(font1);
text(when.monthName() +'  '+ when.day() +'  '+ when.hourMinute(),width/2,height/2);
text(summary,width/2,height/2+40);
pop();

//create button to change °F⇔°C 
button = createButton('°F ⇔°C');
button.style('background-color', 0,0,0);
button.style('font-size', '13px');
button.style('color', "orange");
button.style("border", "none");
button.style("outline", "none");
button.style("font", font1);
button.position(10, height/2+50+moveYPosition2);
button.mousePressed(changeCF);

let temp = w.getTemperature();
let tempF = round(temp); // Fahrenheit
let tempC = round((temp-32)*(5/9));//Celsius
let cloud = round(w.getCloudCover()*100,1);
let wind = round(w.getWindSpeed());
let humid = round(w.getHumidity()*100,1);

//graph temp
let tempsHr = w.getTemperature('hourly');
let leftTemp = 10;
let rightTemp = width/2 - leftTemp;
let topTemp = height -40;
let bottomTemp = height;
let cTemp = color(255,90,99); 
drawGraph(leftTemp,rightTemp,topTemp,bottomTemp,tempsHr,cTemp,moveYPosition2)

//graph humid
let humidsHr = w.getHumidity('hourly');
let leftHu = width/2+10;
let rightHu = width - 10;
let topHu = height -40;
let bottomHu = height;
let cHu = color(124,198,252);
drawGraph(leftHu,rightHu,topHu,bottomHu,humidsHr,cHu,moveYPosition2);

//graph cloud
let cloudsHr = w.getCloudCover('hourly');
let leftClouds = 10;
let rightClouds = width/2 - leftClouds;
let topClouds = height/2 -70;
let bottomClouds = height/2 -30;
let cClouds = color(128,128,128);
drawGraph(leftClouds,rightClouds,topClouds,bottomClouds,cloudsHr,cClouds,moveYPosition1);

//graph wind
let windsHr = w.getWindSpeed('hourly');
let leftWinds = width/2+10;
let rightWinds = width - 10;
let topWinds = height/2 -70;
let bottomWinds = height/2 -30;
let cWinds = color(0,128,0);
drawGraph(leftWinds,rightWinds,topWinds,bottomWinds,windsHr,cWinds,moveYPosition1);

  //draw thermometer
  drawHumid(humid);
  // drawHumid(99);//test


  //draw thermometer
  if (tempMode === 0){
  drawThermo(tempC,"C");
  }
  if (tempMode === 1){
  drawThermo(tempF,"F");
  }

  //draw clowd
  // drawCloud(99);//test
  drawCloud(cloud);

  //draw wind
  drawWind(wind);
  // drawWind();//test

  //drawbottuns
  // drawButtons();

noLoop();
}else{
// if the forecast isn't ready yet, show a message at the center of the screen
push();
fill("black");
rect(0,0,width,height);
textSize(30);
textFont(font1);
fill('white');
text('Loading...',width/2,height/2);
pop();
}
}

function drawHumid(humid){
let deg = 25;
let centerX = width*3/4;
let top = height/2+50;
let bottom = height-50;
let l = (bottom-top)/(1+sin(deg))
let r = l*sin(deg);
let xDrop = [centerX,centerX,centerX+r*cos(deg),centerX,centerX-r*cos(deg)];
let yDrop = [top+l,top,top+l-r*sin(deg),bottom,top+l-r*sin(deg)];
let hAmount = map(humid,0,100,bottom,top+2*fsF);

//guide %
push();
translate(0,moveYPosition2);
textSize(fsG);
textFont(font2);
fill(124,198,252);
for(yi=yDrop[1];yi<yDrop[2];yi+=fsG){
  a1 = (yDrop[2]-yDrop[1])/(xDrop[2]-xDrop[1]);
  a2 = (yDrop[4]-yDrop[1])/(xDrop[4]-xDrop[1]);
  text('%',(yi-(yDrop[1]-a1*xDrop[1]))/a1,yi);
  text('%',(yi-(yDrop[1]-a2*xDrop[1]))/a2,yi);
}

for(i=-deg;i<=180+deg;i+=10){
  text('%',xDrop[0]+r*cos(i),yDrop[0]+r*sin(i))
}

//humid fill
textSize(fsF);
fill(0,251,255);
for(yi=hAmount;yi<bottom;yi+=fsF){
  text(humid,xDrop[0],yi);

}

//right side
for(yi=hAmount;yi<bottom;yi+=fsF){
  a1 = (yDrop[2]-yDrop[1])/(xDrop[2]-xDrop[1]);
  if(yi<yDrop[2]){
  for(xi=xDrop[1]+fsF*1.5;xi<(yi-(yDrop[1]-a1*xDrop[1]))/a1 - fsF*0.5; xi+=fsF*1.5){
    text(humid,xi,yi);
  }
}else{
    for(xi=xDrop[1]+fsF*1.5;xi< xDrop[0] + sqrt(pow(r,2)-pow(yi-yDrop[0],2)) - fsF*0.5;xi+=fsF*1.5){
    text(humid,xi,yi);
  }
}
}

//left side
for(yi=hAmount;yi<bottom;yi+=fsF){
  a2 = (yDrop[4]-yDrop[1])/(xDrop[4]-xDrop[1]);
  if(yi<yDrop[2]){
  for(xi=xDrop[1]-fsF*1.5;xi>(yi-(yDrop[1]-a2*xDrop[1]))/a2 + fsF*0.5;xi-=fsF*1.5){
    text(humid,xi,yi);
  }
}else{
    for(xi=xDrop[1]-fsF*1.5;xi> xDrop[0] - sqrt(pow(r,2)-pow(yi-yDrop[0],2)) + fsF*0.5;xi-=fsF*1.5){
    text(humid,xi,yi);
  }
}
}

pop();

}


//temperature function tempCF <- tempC or tempF, tempUnit <- C or F
function drawThermo(tempCF,tempUnit){
let centerX = width/4;
let centerY = height/2;
let top2 = centerY + 50;//top of the thermo
let bottom2 = height - 50;//bottom of the thermo
let degStep2 = 20;//interval of the arc - thermo
let R = 40;//radius of the thermometer
let theta = 30;
let tAmount;
if(tempUnit === "F"){
tAmount = map(tempCF,-4,100,bottom2-2*R,top2);
}else{
tAmount = map(tempCF,-20,40,bottom2-2*R,top2);
// tAmount = map(35,-20,40,bottom2-2*R,top2);//test
}

push();
translate(0,moveYPosition2);
//guide °F or °C straight parts
textSize(fsG);
textFont(font2);
fill(255,90,99);
for (i=0; i < mesh+1; i++){
//text('°F',centerX-R/2,top2);
text('°'+tempUnit,centerX-R/2,top2+i*(bottom2-R-R*cos(theta)-top2)/mesh);
text('°'+tempUnit,centerX+R/2,top2+i*(bottom2-R-R*cos(theta)-top2)/mesh);
}
for(i = 0; i < (360-2*theta)/degStep2 ;i++){//arc part
text('°'+tempUnit,centerX+R*cos(-(90-theta) + i * degStep2),bottom2-R+R*sin(-(90-theta) + i * degStep2));
}

//temp fill
textSize(fsF);
// fill(242,112,90);
fill(255,165,0);
for(i=0;i < (bottom2 - tAmount)/fsF;i++){
  let yi =tAmount+ i*fsF-fsF;
  text(tempCF,centerX,yi);
  if (yi >= bottom2 - R - R*sin(theta)-fsF){
 
   //arc
    for(j = 1;j <= sqrt(pow(R,2)-pow((yi-(bottom2-R)),2))/(fsF*1.7); j++ ){
      let dxj = j*fsF*1.5; 
      text(tempCF,centerX-dxj,yi);
      text(tempCF,centerX+dxj,yi);
    }

  }else{
    //line
    for(j = 1;j < R*sin(theta)/(fsF*1.5); j++ ){
      let dxj = j*fsF*1.5; 
      text(tempCF,centerX-dxj,yi);
      text(tempCF,centerX+dxj,yi);
      }
    }
  }
pop();
}

//draw cloud
function drawCloud(cloud){
  let r1 = 60;
  let r2 = 45;
  let r3 = 35;
  let centerX1 = width/4+10;
  let centerY1 = height/4;
  let centerX2 = centerX1-r1+10;
  let centerY2 = centerY1+r2-10;
  let centerX3 = centerX1+r2;
  let centerY3 = centerY1+r2+r2-r3-10;
  let cAmount = map(cloud,0,100,centerY2+r2-fsF,centerY1-r1+fsF);


  //guide
  push();
  translate(0,moveYPosition1);
  stroke(128,128,128);
  noFill()
  textSize(fsG);
  textFont(font2);
  for(i=0;i<(centerX3-centerX2)/mesh;i++){
  text('%',centerX2+i*mesh,centerY2+r2);
  }
  //cloud1
  let degStep1 = 15;
  let startDeg1 = -160;
  let endDeg1 = 10;
  for(i=startDeg1;i<endDeg1;i++){
    text('%',centerX1 + r1*cos(i),centerY1+r1*sin(i));
    i += degStep1;
    }
  //cloud2
  let degStep2 = 15;
  let startDeg2 = 90;
  let endDeg2 = 270;
  for(i=startDeg2;i<endDeg2;i++){
    text('%',centerX2 + r2*cos(i),centerY2+r2*sin(i));
    i += degStep2;
    }
  //cloud3
  let degStep3 = 20;
  let startDeg3 = -70;
  let endDeg3 = 90;
  for(i=startDeg3;i<endDeg3;i++){
    text('%',centerX3 + r3*cos(i),centerY3+r3*sin(i));
    i += degStep3;
    }
  pop();

  //fill
  push();
  translate(0,moveYPosition1);
  fill("white");
  textSize(fsF);
  textFont(font2);
  for(yi=centerY2+r2-fsF*1.5; yi >= cAmount ; yi -= fsF){
    xLeft2 = -sqrt(pow(r2,2)-pow((yi-centerY2),2))+centerX2;
    xLeft1 = -sqrt(pow(r1,2)-pow((yi-centerY1),2))+centerX1;
    xRight1 = sqrt(pow(r1,2)-pow((yi-centerY1),2))+centerX1;
    xRight3 = sqrt(pow(r3,2)-pow((yi-centerY3),2))+centerX3;

  if(centerY3 - r3< yi){
    for(j=xLeft2+fsF*1.5; j<xRight3-fsF*0.5; j+=fsF*1.5){
      text(cloud,j,yi);
    }
  }
  if(centerY2-r2 < yi && yi< centerY3 - r3){
    for(j=xLeft2+fsF*1.5; j<=xRight1-fsF*0.5; j+=fsF*1.5){
      text(cloud,j,yi);
    }
  }
  if(yi< centerY2-r2 ){
    for(j=xLeft1+fsF*1.5; j<=xRight1-fsF*0.5; j+=fsF*1.5){
      text(cloud,j,yi);
    }
  }
  }
  pop();
}

function drawWind(wind){
  let centerX = width*(3/4);
  let centerY = height*(1/4)
  let quadWidth = 0.35*width;
  let quadHeight1 = 120; //left
  let quadHeight2 = 80; //right
  let xQuad = [width/2+40,width/2+40+quadWidth,width/2+40+quadWidth,width/2+40];
  let yQuad = [centerY-quadHeight1/2,centerY-quadHeight2/2,centerY+quadHeight2/2,centerY+quadHeight1/2];
  let wAmount = map(wind,0,40,xQuad[0]+1.5*fsF,xQuad[1]-1.5*fsF);

 //wind guideline
  push();
  translate(0,moveYPosition1);
  textStyle(BOLD);
  fill(0,128,0);
  textSize(fsG);
  textFont(font2);
  for(xi=xQuad[0];xi<xQuad[1];xi+=fsG*2.4){//upper
    a = (yQuad[1]-yQuad[0])/(xQuad[1]-xQuad[0]);
    text('mph',xi,a*xi+yQuad[0]-a*xQuad[0]);
  }
  for(xi=xQuad[3];xi<xQuad[2];xi+=fsG*2.4){//lower
    a = (yQuad[2]-yQuad[3])/(xQuad[2]-xQuad[3]);
    text('mph',xi,a*xi+yQuad[3]-a*xQuad[3]);
  }
  textSize(fsF);
  for(yi=yQuad[0]+0.9*fsG;yi<yQuad[3]-0.4*fsG;yi+=fsG*1.5){
    text('mph',xQuad[0]-5,yi);
  }
  for(yi=yQuad[1]+0.9*fsG;yi<yQuad[2]-0.4*fsG;yi+=fsG*1.5){
    text('mph',xQuad[1],yi);
  }
  for(yi=centerY;yi<height/2-80;yi+=fsG){
    text('mph',width/2+20,yi);
  }
  pop();
  
  //wind fill
  push();
  translate(0,moveYPosition1);
  fill(72,240,65);
  textSize(fsF);
  textFont(font2);
  for(xi=xQuad[0]+1.5*fsF;xi<wAmount;xi+=fsF*1.5){
    a1 = (yQuad[1]-yQuad[0])/(xQuad[1]-xQuad[0]);//upper slope
    a2 = (yQuad[2]-yQuad[3])/(xQuad[2]-xQuad[3]);//lower slope
    for(yi=a1*xi+yQuad[0]-a1*xQuad[0]+fsG; yi < a2*xi+yQuad[3]-a2*xQuad[3]-fsG*0.7;yi+=fsF){
      text(wind,xi,yi);
    }
  }
  pop();

}

function drawGraph(left,right,top,bottom,val,color,moveYPosition){
let minVal = roundDown(min(val));
let maxVal = roundUp(max(val));
  push();
  translate(0,moveYPosition);
stroke(color);
    strokeWeight(1);
    noFill();
    beginShape();
    for (let i = 0; i < 24; i++) { //24時間分なので i < 24としている。
      let x = map(i, 0, 24, left, right);//iが0から24に動く時に、左端から右端に動くようにする。
      let y = map(val[i], minVal, maxVal, bottom, top);
      vertex(x, y);//vertexは点を打ってそれぞれをつなぐ関数。それぞれのxに対してズラッと並べて書いたのと同じ効果が出ている。
    }
  endShape();

let currentY = map(val[0], minVal, maxVal, bottom, top);
noStroke();
fill(color);
ellipse(left, currentY, 10, 10);
  pop();
}

function changeCF(){
  if (tempMode === 0){
    tempMode = 1;
    }else{
    tempMode = 0;
    }
  draw();
}

// function drawButtons(){
//   let leftButtons = 50;
//   let rightButtons = width-50;
//   let positionXOFButtons = [];
//   let positionYOfButtons = height-35; 
//   push();
//   strokeWeight(5);
//   fill(255,255,255);
//   stroke(255,255,255,100);
//   line(leftButtons,positionYOfButtons,rightButtons,positionYOfButtons);
//   fill(255,255,255,100);
//   strokeWeight(0);
//   stroke(255,255,255,100);
//   for(i=0; i<=12;i++){
//   positionXOFButtons[i] = leftButtons+i*(rightButtons-leftButtons)/12 
//   ellipse(positionXOFButtons[i],positionYOfButtons,5);
//   }
//   pop();
// }

function mousePressed() {
  w.requestForecast('gps');
}