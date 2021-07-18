const express = require("express");
const bodyParser = require("body-parser");
const _ = require('lodash');
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("src"));

var header_desc, report, gender, height, height_m, weight, speed, steps, dios, td, tt, tt_min, vo_two, calpm, tcb, d_weight, rem_weight, d_time, bmi, sug_weight, sug_steps, sug_dis, sug_time, sug_days;
var loss_diet ="egg white, green veggies, meat, fish, olive oil, green tea, beans, black coffee, soups, apple cider vinegar, onions, chili pepper, citrus fruits, lemon, yogurt, oats, Chickpeas, almonds, walnuts";
var loss_diet_comp = "protein, vitamin C, caffeine, less fat ,and fewer calories";

//##########################################################


function bmiCalc(h,w){
var he = Math.pow(h,2)/10000;
var bmi_num = w/he;
sug_weight = 22.75 * he;
return bmi_num;
}

function bmiReport(bmi_num){
if(gender == 'm'){
  if(bmi_num < 18.5)
    report = "Under Weight";
  else if(bmi_num >= 18.5 && bmi_num <= 24.9)
    report = "Normal";
  else if(bmi_num >= 25 && bmi_num <= 29.9)
    report = "Over Weight";
  else if(bmi_num >= 30 && bmi_num <= 34.9)
    report = "Obese";
  else if(bmi_num > 35)
    report = "Extremely Obese";
}
else if(gender == 'f'){
  if(bmi_num < 18.5)
    report = "Under Weight";
  else if(bmi_num >= 18.5 && bmi_num <= 24.9)
    report = "Normal";
  else if(bmi_num >= 25 && bmi_num <= 29.9)
    report = "Over Weight";
  else if(bmi_num >= 30 && bmi_num <= 39.9)
      report = "Obese";
  else if(bmi_num > 40)
    report = "Extremely Obese";
}
return report;
};

function walkStat(){
  if(gender == 'm')
      dios = height * 0.415;
  else if(gender == 'f')
      dios = height * 0.413;
  rem_weight = weight - d_weight;
  tcb = (rem_weight*100000)/13;
  vo_two = (speed*0.1) + 3.5;
  calpm = ((vo_two * weight)/1000) * 5;
  tt_min = tcb/calpm;
  tt = tt_min/d_time;
  td = (speed*tt)/1000;
  steps = (td/dios)*100000;
  //###
  sug_steps = 20000;
  var sug_rem_weight = weight - sug_weight;
  var sug_tcb = (sug_rem_weight*100000)/13;
  var sug_tt_min = sug_tcb/calpm;
  sug_dis = (dios * sug_steps)/100000;
  sug_time = 120;
  sug_days =  sug_tt_min / sug_time;
}

function timeConvert(n) {
var num = n;
var hours = (num / 60);
var rhours = Math.floor(hours);
var minutes = (hours - rhours) * 60;
var rminutes = Math.round(minutes);
return rhours + " Hr and " + rminutes + " min";
}


//##########################################################


app.get("/", function(req , res){
res.render("home");
});

app.post("/", function(req , res){
  gender = req.body.gender;
  height = req.body.height;
  weight = req.body.weight;
  speed = parseInt(req.body.speed);
  d_time = req.body.dtime;
  d_weight = req.body.dweight;
    res.redirect("/result");
});

app.get("/result", function(req , res){
  var header_dec_border, header_dec_bg, result_border, result_bg;
walkStat();
bmi = bmiCalc(height,weight);
if(height > 250 || height < 60 || weight > 250 ||  weight < 30){
  header_desc = "Your Height-Weight seems very abnormal. If this is your correct Height-Weight please consult a doctor.";
  header_dec_border="#ff2626";
  header_dec_bg ="#ffa1a1";
}else{
  header_desc = "You are already above 50% of people. By checking this you have already started your journey towards a healthy and fit you."
  header_dec_border="#2693ff";
  header_dec_bg ="#a1d0ff";
}

if(report === "Extremely Obese" || report === "Under Weight"){
  result_border = "#ff2626";
  result_bg = "#ffa1a1";
}else if (report === "Normal"){
  result_border = "#26ff75";
  result_bg = "#a1ffc3";
}else{
  result_border = "#ffea26";
  result_bg = "#fff6a1";
}
var error_desc = "";
if(rem_weight <= 0){
  error_desc = "You are trying to gain weight. We don't support weight gaining calculations.";
  res.render("error",{error_desc:error_desc});
}else if(d_weight < sug_weight){
  error_desc = "The weight you have targetted is below the mark you should go. Retargeting your weight is suggested.";
  res.render("error",{error_desc:error_desc});
}else{
res.render("result",{header_dec_border:header_dec_border, gender:gender, header_dec_bg:header_dec_bg, result_border:result_border,result_bg:result_bg,header_desc:header_desc,sug_days:Math.ceil(sug_days) ,sug_dis: Math.round(sug_dis), sug_weight: Math.round(sug_weight), l_w_d: loss_diet, l_w_c: loss_diet_comp, height: height, weight: weight, bmi: bmiReport(bmi), tt: timeConvert(tt), td: Math.round(td) , steps: Math.ceil(steps/ 100)*100, d_time:d_time });
}
});


//##########################################################

app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000");
});
