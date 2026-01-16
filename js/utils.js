function getYearMonthDate(dateString) {
  let year = dateString.substring(0, 4);
  let month = dateString.substring(4, 6);
  let day = dateString.substring(6, 8);
  return [year, month, day];
}

function getCompositeDate(dateString, toVal) {
  let year = dateString.substring(0, 4);
  let month = dateString.substring(4, 6);
  let day = dateString.substring(6, 8);
  let date = new Date(year, month - 1, day);

  let compositeDateVal1 = date.getTime() - toVal * 86400000;

  let compositeDate = new Date(compositeDateVal1);

  let toYear = String(compositeDate.getFullYear())
  let toMonth = String(compositeDate.getMonth() + 1);
  toMonth = toMonth.length == 1 ? "0" + toMonth : toMonth;
  let toDay = String(compositeDate.getDate());
  toDay = toDay.length == 1 ? "0" + toDay : toDay;

  let compositeDateVal = toYear + toMonth + toDay;

  return compositeDateVal;
}

function getStyleForFireEvent(op) {
  let selected_style = '';
  if (op === "PIXEL_AREA"){
    //selected_style = "[0:FF0000;1.5:000080;3:0000FF;4.5:007DFF;6:13FDE4;7.5:7AFF7D;9:E1FF16;10.5:FF9800;12:FF2200;13.5:800000; 15:800000];nodata:FFFFFF00";
    selected_style = "0:ffffff;(0:d3d3d3:1];(1:ffc0cb:2];(2:ee82ee:3];(3:9400d3:4];(4:1e90ff:5];(5:4169e1:6];(6:0000ff:7];(7:00008b:8];(8:00ffff:9];(9:008080:10];(10:00fa9a:11];(11:00ff00:12];(12:9acd32:13];(13:008000:14];(14:808000:15];(15:ffff00:16];(16:ffd700:18];(18:ffa500:20];(20:cd5c5c:25];(25:ff0000:30];(30:800000:40];(40:000000:10000];nodata:ffffff"
  }
    else if (op === "EVENTS_COUNT") {
      selected_style = "0:ffffff;(0:d3d3d3:3];(3:ffc0cb:6];(6:ee82ee:9];(9:9400d3:13];(13:1e90ff:16];(16:4169e1:19];(19:0000ff:25];(25:00008b:30];(30:00ffff:35];(35:008080:40];(40:00fa9a:45];(45:00ff00:50];(50:9acd32:60];(60:008000:70];(70:808000:80];(80:ffff00:90];(90:ffd700:100];(100:ffa500:200];(200:cd5c5c:300];(300:ff0000:400];(400:800000:500];(500:000000:10000];nodata:ffffff"
    //selected_style = "[0:FBFBFB;1:000080;8:0000FF;15:007DFF;22:13FDE4;29:7AFF7D;36:E1FF16;43:FF9800;50:FF2200;57:800000; 64:800000];nodata:FFFFFF00";
  } else if (op === "FIRE_RADIATIVE_POWER"){
    //selected_style = "[0:FBFBFB;34:000080;68:0000FF;103:007DFF;137:13FDE4;172:7AFF7D;206:E1FF16;241:FF9800;275:FF2200;310:800000; 360:800000];nodata:FFFFFF00";
    selected_style = "0:ffffff;(0:d3d3d3:10];(10:ffc0cb:20];(20:ee82ee:30];(30:9400d3:40];(40:1e90ff:50];(50:4169e1:60];(60:0000ff:70];(70:00008b:80];(80:00ffff:90];(90:008080:100];(100:00fa9a:125];(125:00ff00:150];(150:9acd32:175];(175:008000:200];(200:808000:250];(250:ffff00:300];(300:ffd700:400];(400:ffa500:500];(500:cd5c5c:600];(600:ff0000:800];(800:800000:1000];(1000:000000:10000];nodata:ffffff"
  }

  return selected_style
}


function removeDupliactesFromArrayOfObject(arr) {
  //Removing duplicate dates from array
  const uniqueArray = Array.from(
    new Set(arr.map((el) => JSON.stringify(el)))
  ).map((el) => JSON.parse(el));
  return uniqueArray;
}

//Sort array in descending order
async function sortDateArray(arr) {
  return arr.sort((a, b) => {
    return parseInt(b.val) - parseInt(a.val);
  });
}

//Sort array in descending order
async function sortStringDateArray(arr) {
  return arr.sort((a, b) => {
    return b.val.localeCompare(a.val);
  });
}

function adjustingDate(data) {
  let newData = data.map((dateString) => {
    const year = parseInt(dateString.substring(0, 4));
    const month = parseInt(dateString.substring(4, 6)) - 1;
    const day = parseInt(dateString.substring(6, 8));

    const date = new Date(year, month, day);

    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    if (isLeapYear && month === 1 && day > 18) {
      date.setDate(date.getDate() + 8);
    } else {
      date.setDate(date.getDate() + 7);
    }
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  });
  return newData;
}

async function formatGeoEntityDates(timestamps) {
  console.log("this is timestamps barbad", timestamps);
  return timestamps.map((ts) => {
    // Add 5 hours 30 minutes in seconds: (5 * 3600) + (30 * 60) = 19800 seconds
    const adjustedTs = ts;

    const date = new Date((adjustedTs+19800) * 1000); // Convert adjusted timestamp to Date object

    // Pad helper function
    const pad = (num) => String(num).padStart(2, "0");

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    const formattedLabel = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    const formattedDate = `${year}${month}${day}${hours}${minutes}${seconds}`;

    return { lbl: formattedLabel, val: adjustedTs};
  });
}


async function formatDates(
  data,
  splitOn,
  dateAtIndex,
  addNumberOfdaysInLabel,
  dateLabelFormat
) {
  //
  console.log("data,splitOn",data,splitOn);
  console.log("dateAtIndex",dateAtIndex);
  console.log("addNumberOfdaysInLabel",addNumberOfdaysInLabel);
  console.log("dateLabelFormat",dateLabelFormat);
  let processedData = data.map((dtTime) => {
    //Spliting date to get only yyyymmdd format date
    splittedDt = dtTime.split(splitOn);
    //at 0 index date in yyyymmdd and at 1 index time
    

    let requiredData = splittedDt[parseInt(dateAtIndex)];
    
    

    //get Year, month, date from required data
    let year = requiredData.substring(0, 4);
    let month = requiredData.substring(4, 6);
    let dt = requiredData.substring(6, 8);

    requiredData = year + month + dt;
    let date = new Date(year, month - 1, parseInt(dt));
    let updateDateLabel = "";

    if (addNumberOfdaysInLabel) {
      if (typeof addNumberOfdaysInLabel === "number") {
        // Original logic when a single number is passed
        date.setDate(date.getDate() + addNumberOfdaysInLabel);

        updateDateLabel = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      } else if (typeof addNumberOfdaysInLabel === "object") {
        // New logic for range-based addition (month and day only)
        let daysToAdd = 0;

        const formattedDate = (inputDate) =>
          `${String(inputDate.getMonth() + 1).padStart(2, "0")}-${String(
            inputDate.getDate()
          ).padStart(2, "0")}`;

        const currentMonthDay = formattedDate(date);

        Object.entries(addNumberOfdaysInLabel).forEach(([key, range]) => {
          const fromMonthDay = formattedDate(
            new Date(`2000-${range.fromTime}`)
          );
          const toMonthDay = formattedDate(new Date(`2000-${range.toTime}`));

          if (
            currentMonthDay >= fromMonthDay &&
            currentMonthDay <= toMonthDay
          ) {
            daysToAdd = parseInt(key, 10); // Use the key as the number of days to add
          }
        });

        if (daysToAdd > 0) {
          date.setDate(date.getDate() + daysToAdd);

          updateDateLabel = `${date.getFullYear()}-${String(
            date.getMonth() + 1
          ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
        } else {
        }
      }
    }
    

    let label;
    if (dateLabelFormat=="AY") {
      if(parseInt(month)>=6){
        label = "AY "+year+"-"+(parseInt(year)+1);
      }else{
        label = "AY "+(parseInt(year)-1) +"-"+year ;
      }
      
    } else if (dateLabelFormat === "DDBB"){
      const getMonthName = index => new Date(0, index).toLocaleString('default', { month: 'long' });
      label =  dt + "-" + getMonthName(month-1);  
    } else if (updateDateLabel) {
      label = updateDateLabel;
    } else {
      label = year + "-" + month + "-" + dt;
    }
 
    //
    // console.log("label::",label,requiredData)
    return { lbl: label, val: requiredData };
  });

  let sortedData = await sortDateArray(processedData);
  //
  return sortedData;
}

async function formatDatesInsat3R(
  data,
  splitOn,
  dateAtIndex,
  addNumberOfdaysInLabel,
  dateLabelFormat
) {
  console.log("data,splitOn",data,splitOn);
  console.log("dateAtIndex",dateAtIndex);
  console.log("addNumberOfdaysInLabel",addNumberOfdaysInLabel);
  console.log("dateLabelFormat",dateLabelFormat);
  let processedData = data.map((dtTime) => {
  let formattedDt = dtTime
  .replace(/^(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')  // 20250813 -> 2025-08-13
  .replace(" ", "T")                            // space to T
  .replace(/(\+[\d]{2})([\d]{2})$/, "$1:$2");  // +0530 to +05:30

    let insatdt = new Date(formattedDt);

    // Extract parts
    let year = insatdt.getFullYear();
    let month = String(insatdt.getMonth() + 1).padStart(2, '0');
    let dt = String(insatdt.getDate()).padStart(2, '0');
    let hours = String(insatdt.getHours()).padStart(2, '0');
    let minutes = String(insatdt.getMinutes()).padStart(2, '0');

    // Format result
    let requiredData = `${year}${month}${dt}${hours}${minutes}`;

    let label;
    label = year + "-" + month + "-" + dt + " " + hours + ":" + minutes;
    return { lbl: label, val: requiredData };
  });
  return processedData;
}

function replaceParamsPlaceHolders(layerParams, replaceDictionary) {
  let obj = {};
  //Get UI to Factory params
  if (layerParams) {
    let params = layerParams;

    if (replaceDictionary.pol) {
      let selectedPol = replaceDictionary.pol;
      params = layerParams[selectedPol];
    }

    Object.keys(params).forEach((key) => {
      let val = "";
      if (params[key].includes("{{{")) {
        if (replaceDictionary.hasOwnProperty('dateoperations') && replaceDictionary['dateoperations'] === 'single') {
          console.log('Hello');
          replaceDictionary['fromDate'] = replaceDictionary['singleDate'];
          replaceDictionary['toDate'] = replaceDictionary['singleDate'];
        } else {
          console.log('Hi');
        }



        console.log('Rayta:::', key, params, replaceDictionary);
        val = replaceUrlAndParamPlaceholders(params[key], replaceDictionary);
      } else {
        val = params[key];
      }
      obj[key] = val;
    });
  }

  return obj;
}

//Function to replace parameters in url with value.
function replaceUrlAndParamPlaceholders(obj, replacements) {
  return obj.replace(/\{\{\{([^}]+)\}\}\}/g, function (match, key) {
    return replacements[key]; // Replace with value from replacements object, or empty string if not found
  });
}

function getURLAndParams(layerConfig) {
  console.log(layerConfig)
  let url = layerConfig.layerFactoryParams.urlTemplate;
  let replaceDictionary = "";
  let parameters = layerConfig.parameters;

  if (layerConfig.uiToFactoryParamsConvertor) {
    console.log(layerConfig);
    replaceDictionary = layerConfig.uiToFactoryParamsConvertor(
      layerConfig.parameters
    );
  }

  if (parameters) {
    if (
      parameters.compositeDateOptions &&
      parameters.compositeDateOptions.selectedOption.val != 1
    ) {
      if (layerConfig.isRGB) {
        replaceDictionary = calculateToAndFromDate(
          parameters,
          "rFromDate",
          "rToDate",
          replaceDictionary
        );
        replaceDictionary = calculateToAndFromDate(
          parameters,
          "gFromDate",
          "gToDate",
          replaceDictionary
        );
        replaceDictionary = calculateToAndFromDate(
          parameters,
          "bFromDate",
          "bToDate",
          replaceDictionary
        );
      } else if (layerConfig.isDifference) {
        replaceDictionary = calculateToAndFromDate(
          parameters,
          "aFromDate",
          "aToDate",
          replaceDictionary
        );
        replaceDictionary = calculateToAndFromDate(
          parameters,
          "bFromDate",
          "bToDate",
          replaceDictionary
        );
      } else {
        replaceDictionary = calculateToAndFromDate(
          parameters,
          "fromDate",
          "toDate",
          replaceDictionary
        );
      }
    }
  }
  replaceDictionary["datasetId"] = layerConfig.datasetId;
  layerConfig["replaceDictionary"] = replaceDictionary;

  url = url.includes("{{{")
    ? replaceUrlAndParamPlaceholders(url, replaceDictionary)
    : url;

  let params = replaceParamsPlaceHolders(
    layerConfig.layerFactoryParams.layerParams,
    replaceDictionary
  );
  if (layerConfig.id.includes("fire")){
    // console.log("i got the fire ", layerConfig );
    params.STYLES = getStyleForFireEvent(layerConfig?.replaceDictionary?.operation)
    // params.STYLES = 
  }
  

  
  console.log()

  return {
    url: url,
    params: params,
  };
}

function calculateToAndFromDate(
  parameters,
  fromDateToFetch,
  toDateToFetch,
  replaceDictionary
) {
  let compositeDateVal = parameters.compositeDateOptions.selectedOption.val;
  let [fromDate, toDate] = [
    replaceDictionary[fromDateToFetch],
    replaceDictionary[toDateToFetch],
  ];

  let obj = {
    dateVal: "",
    fromDateValDiff: "",
    toDateValDiff: "",
    lastDay: "",
  };

  switch (compositeDateVal) {
    case 5:
      let selectedMidDateVal =
        parameters[toDateToFetch + "5"].selectedOption.val;
      obj.dateVal = selectedMidDateVal;
      obj.fromDateValDiff = 2;
      obj.toDateValDiff = 2;
      obj.lastDay = 28;

      break;
    case 10:
      let selectedMidDate10Val =
        parameters[toDateToFetch + "10"].selectedOption.val;
      obj.dateVal = selectedMidDate10Val;
      obj.fromDateValDiff = 4;
      obj.toDateValDiff = 5;
      obj.lastDay = 25;

      break;
    case 15:
      let selectedMidDate15Val =
        parameters[toDateToFetch + "15"].selectedOption.val;
      obj.dateVal = selectedMidDate15Val;
      obj.fromDateValDiff = 7;
      obj.toDateValDiff = 7;
      obj.lastDay = 23;

      break;
    case 30:
      let selectedMidDate30Val =
        parameters[toDateToFetch + "30"].selectedOption.val;
      obj.dateVal = selectedMidDate30Val;
      obj.fromDateValDiff = 14;
      obj.toDateValDiff = 15;
      obj.lastDay = 15;

      break;
  }
  [fromDate, toDate] = getFromAndToDate(obj);

  replaceDictionary[fromDateToFetch] = fromDate;
  replaceDictionary[toDateToFetch] = toDate;
  return replaceDictionary;
}

function getFromAndToDate(obj) {
  let dt = obj.dateVal.substring(6, 8);
  let month = obj.dateVal.substring(4, 6);
  let year = obj.dateVal.substring(0, 4);

  dt = parseInt(dt);
  month = parseInt(month);
  lastDate = getLastDayOfMonth(year, month);

  let fromDate = dt - obj.fromDateValDiff;

  let toDate = dt == obj.lastDay ? lastDate : dt + obj.toDateValDiff;

  fromDate = String(fromDate);
  toDate = String(toDate);

  fromDate = fromDate.length == 1 ? "0" + fromDate : fromDate;
  toDate = toDate.length == 1 ? "0" + toDate : toDate;

  fromDate = obj.dateVal.substring(0, 6) + fromDate;
  toDate = obj.dateVal.substring(0, 6) + toDate;

  return [fromDate, toDate];
}

function getLastDayOfMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

function dateStringToDateObj(year, month, day) {
  return {
    lbl: year + "-" + month + "-" + day,
    val: year + month + day,
  };
}

function deepCopyObj(obj) {
  // Declare object which will store the output
  const result = {};

  // If the object isnt of type object or
  // object is null, undefined, is an Array
  // or a function then no need to iterate
  // over it and simply return it
  if (
    typeof obj !== "object" ||
    typeof obj === undefined ||
    obj === null ||
    Array.isArray(obj) ||
    typeof obj == "function"
  ) {
    return obj;
  }

  // Store the keys of the object
  const keys = Object.keys(obj);

  // Iterate through the keys of the
  // object retrieved above
  for (let key in keys) {
    // Recursively iterate through each of the key.
    result[keys[key]] = deepCopyObj(obj[keys[key]]);
  }
  return result;
}
//This function enables to filter data of dates with allowed values.

function filterDatesWithinRange(allowedValues, sortdDateArray) {
  let filteredDates = [];

  if (allowedValues) {
    let allowedValLength = allowedValues.length;
    let addedDates = [];

    sortdDateArray.forEach((x) => {
      let newDate = { lbl: "", val: "" };
      let dt = x.lbl.split("-")[2];
      for (var i = 0; i < allowedValLength; i++) {
        if (allowedValues[i].fromDt <= dt && allowedValues[i].toDt >= dt) {
          let [year, month, day] = getYearMonthDate(x.val);
          newDate.val = year + month + allowedValues[i].valToPush;
          if (!addedDates.includes(newDate.val)) {
            newDate.lbl = year + "-" + month + "-" + allowedValues[i].valToPush;
            filteredDates.push(newDate);
            addedDates.push(newDate.val);
          }
        }
      }
    });
  }

  return filteredDates;
}

function getReplaceDictValueFromUI(
  replaceDictionary,
  params,
  key,
  param,
  newDictionaryKey,
  useDictionaryKey
) {
  replaceDictionary[key] = param.selectedOption.val;
  if (params.compositeDateOptions) {
    let from_val = parseInt(params.compositeDateOptions.selectedOption.val);
    replaceDictionary[newDictionaryKey] = getCompositeDate(
      replaceDictionary[useDictionaryKey],
      from_val - 1
    );
  }
}

async function getAddress(lon, lat) {
  try{
  let response = await fetch(
    "https://apis.mapmyindia.com/advancedmaps/v1/nwsgvbqbbw5ejwj112vvisgoggiq4ov3/rev_geocode?lat=" +
      lat +
      "&lng=" +
      lon
  );
  let result = await response.json();
  result = result["results"];
  result = result[0];
  let locInfo = result["formatted_address"];
  if (locInfo.startsWith("Unnamed Road")) {
    locInfo = locInfo.substring(14, 200);
  }
  let address =
  "<span style='font-weight:bold;color: #0488d0;font-size:16px'>(Lat, Long):</span><span style='font-size:16px'> (" +
  lat.toFixed(5) +", " +lon.toFixed(5) +
  ") &nbsp;&nbsp;&nbsp;</span><span style='font-weight:bold;color: #0488d0;font-size:16px'>Location:</span><span style='font-size:16px'> " +
  locInfo+'</span>';
return address;
} catch{

    return  "<span style='font-weight:bold;color: #0488d0;font-size:16px'>(Lat, Long):</span><span style='font-size:16px'> (" +
    lat.toFixed(5) +", " +lon.toFixed(5) +
    ") &nbsp;&nbsp;&nbsp;</span><span style='font-weight:bold;color: #0488d0;font-size:16px'>Location:</span><span style='font-size:16px'> " +
    'Reverse Geocoding Failed'+'</span>';

}
}
