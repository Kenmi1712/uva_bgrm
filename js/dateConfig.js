const monthToNum = {
  JAN: "01",
  FEB: "02",
  MAR: "03",
  APR: "04",
  MAY: "05",
  JUN: "06",
  JUL: "07",
  AUG: "08",
  SEP: "09",
  OCT: "10",
  NOV: "11",
  DEC: "12",
};

export async function getAsyncData(url, isText = false) {
  let response = await fetch(url);
  let res = isText ? await response.text() : await response.json();

  return res;
}

export async function getInsatAvlDates(url) {
  let res = await getAsyncData(url, true);

  let splitFileraw = [];
  let data = [];
  splitFileraw = res.split("*");
  splitFileraw = splitFileraw.filter(function (x) {
    return x.indexOf("3RIMG") >= 0 && x.indexOf("h5") >= 0;
  });
  let splitFilerawLength = splitFileraw.length;
  for (let i = 0; i <= splitFilerawLength - 1; i++) {
    if (i == 0) {
      data[i] = splitFileraw[i].substring(7, 38);
    } else {
      data[i] = splitFileraw[i].substring(24, 55);
    }
  }

  let insatvisOptions = data.map(function (obj) {
    let splitdata = obj.split("_");

    //Date Spliting
    let sdataf = splitdata[1];
    let sdatafinal = sdataf.substring(0, 9);
    let year = sdatafinal.substring(5, 9);
    let month = sdatafinal.substring(2, 5);
    let date1 = sdatafinal.substring(0, 2);

    //Time Spliting
    let stime = splitdata[2];
    let sHrs = stime.substring(0, 2);
    let sMnt = stime.substring(2, 4);
    let myMonthNum = monthToNum[month];
    let dt_str =
      year + "-" + myMonthNum + "-" + date1 + " " + sHrs + ":" + sMnt;

    let dt = new Date(dt_str);
    dt.setHours(dt.getHours() + 5);
    dt.setMinutes(dt.getMinutes() + 30);

    let dtInsat = moment(dt).format("DD-MM-YYYY HH:mm "); //24Hours Time
    return { lbl: dtInsat, val: date1 + month + year + "_" + stime };
  });

  //Remove invalid date from date of array
  let result = insatvisOptions.filter(
    (x) => x.lbl.toLowerCase() != "invalid date"
  );

  let sortdDateArray = await sortStringDateArray(result);
  return sortdDateArray;
}

function convertToUTC(dateString) {
  // Adjust the format to make it ISO 8601 compatible
  const formattedDateString = dateString.replace(
    /(\d{4})(\d{2})(\d{2}) (\d{2}:\d{2}:\d{2})([+-]\d{4})/,
    "$1-$2-$3T$4$5"
  );

  // Create a Date object from the formatted string
  const date = new Date(formattedDateString);

  // Check if the date is valid
  if (isNaN(date)) {
    throw new Error("Invalid date format");
  }

  // Get the Unix timestamp in seconds (convert milliseconds to seconds)
  const unixTimestamp = Math.floor(date.getTime() / 1000)+19800;

  // Return the Unix timestamp as a string
  return unixTimestamp.toString();


}

export async function getRidamAvlTimestamp(url,datasetId, utc_timestamp_flag=false) {
  
  let output = await getAsyncData(url+datasetId);
  console.log('output:::',url+datasetId);
  let res = output.result[datasetId];
  let formattedDate = res.map(item => {
    // Reformat input string from "YYYYMMDD HH:MM:SS+ZZZZ" to "YYYY-MM-DD HH:MM:SS+ZZZZ"
    console.log("Debug date",item)
    const formattedString = item.replace(
      /^(\d{4})(\d{2})(\d{2}) (\d{2}):(\d{2}):(\d{2})([+-]\d{4})$/,
      (match, year, month, day, hour, minute, second, offset) => {
        // Convert +0530 → +05:30 for ISO compatibility
        const isoOffset = offset.slice(0, 3) + ":" + offset.slice(3);
        return `${year}-${month}-${day}T${hour}:${minute}:${second}${isoOffset}`;
      }
    );
    console.log("Debug date formatted string",formattedString)
    var dateObject = new Date(formattedString);
    console.log("Debug date formatted string",dateObject)
    let label_for_date = '';
    if (datasetId === "T5S7P1"){
       label_for_date = dateObject.getFullYear() + "-" +
        String(dateObject.getMonth() + 1).padStart(2, "0") + "-" +
        String(dateObject.getDate()).padStart(2, "0") + " VALID UPTO " +
        String(dateObject.getHours()).padStart(2, "0") + ":" +
        String(dateObject.getMinutes()).padStart(2, "0");
    } else {
    
     label_for_date = dateObject.getFullYear() + "-" +
                      String(dateObject.getMonth() + 1).padStart(2, "0") + "-" +
                      String(dateObject.getDate()).padStart(2, "0") + " " +
                      String(dateObject.getHours()).padStart(2, "0") + ":" +
                      String(dateObject.getMinutes()).padStart(2, "0");
    }
    //console.log("Original val:", val,"Updated val:", updated_val);         // 2025-05-05 01:45
    // console.log("val",val);
    

    //------------------------Date Formatting Start-----------
    
    const datePart = item.slice(0, 8); // "YYYYMMDD"
    let newHours = dateObject.getHours().toString().padStart(2, '0');
    let newMinutes = dateObject.getMinutes().toString().padStart(2, '0');
    const newTimePart = newHours + newMinutes; 
    if (utc_timestamp_flag==true)
    {
      dateObject = convertToUTC(item);
    } else {
      dateObject = datePart + newTimePart;
    }

    
    //------------------------Date Formatting-----------




    return { lbl: label_for_date, val: dateObject };
   
  });
  
  // Sort the formattedDate array by the 'val' property in descending order
  formattedDate.sort((a, b) => Number(b.val) - Number(a.val));


if (datasetId === "T2S1P24") {
  formattedDate = formattedDate.slice(0, 290);
}

console.log("the formattedDate is--> ", formattedDate);
return formattedDate;


}


