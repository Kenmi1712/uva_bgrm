// https://vedas.sac.gov.in/geoentity-services/api/geoentity-sources/3/params/values?params=21&prefix=C91S24

let base_url = "https://vedas.sac.gov.in/geoentity-services/api/";
let dev_base_url = "https://vedas.sac.gov.in/geoentity-services-dev/api/";

// implement getGeoentitySources function
async function getGeoEntitySources() {
  const response = await fetch(base_url + "geoentity-sources/");
  if (!response.ok) {
    throw new Error(
      `Failed to fetch geo-entity sources (${response.status} ${response.statusText})`
    );
  }
  const data = await response.json();
  return data.data;
}

// implement getParameterTimestamps function
async function getParameterTimestamps(id, params) {
  // join params array with a comma
  params = params.join(",");

  const response = await fetch(
    base_url + `geoentity-sources/${id}/params/timestamps?params=${params}`
  );
  if (!response.ok) {
    throw new Error(
      `Failed to fetch geo-entity source with ID ${id} (${response.status} ${response.statusText})`
    );
  }
  const data = await response.json();
  return data;
}

async function getSourceById(id) {
  const response = await fetch(base_url + `geoentity-sources/${id}/`);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch geo-entity source with ID ${id} (${response.status} ${response.statusText})`
    );
  }
  const data = await response.json();
  return data;
}

export function get_chart_series({
  data = null,
  property_path = null,
  param_id = null,
  geoentity_id = null,
  name = "",
  filter_function = (x) => true,
  transform_function = (x) => x,
  cumulative = false,
  add_ist = true,
}) {
  const seriesData = [];
  var cumulativeSum = 0;
  let paramData = JSON.parse(
    JSON.stringify(data[geoentity_id].param_values[param_id])
  );

  for (const timestamp in paramData) {
    var prop_paths = property_path.split(".");

    var meanValue = paramData[timestamp];

    for (var pi = 0; pi < prop_paths.length; pi++) {
      if (prop_paths[pi]) {
        meanValue = meanValue[prop_paths[pi]];
      }
    }

    if (meanValue === null || isNaN(meanValue) || !filter_function(meanValue)) {
      continue;
    }

    if (!isNaN(meanValue)) {
      cumulativeSum += parseFloat(meanValue);
    }

    // console.log("Value inserted", meanValue, cumulativeSum);

    // If the mean value is null or the filter function returns false, skip this value
    if (cumulative) {
      // console.log("Inserting cumulative");
      seriesData.push([
        (Number(timestamp) + 11 * 30 * 60) * 1000,
        transform_function(cumulativeSum),
      ]);
    } else {
      seriesData.push([
        (Number(timestamp) + 11 * 30 * 60) * 1000,
        transform_function(meanValue),
      ]);
    }
  }

  console.log('Series data',seriesData);
  return [
    {
      name: name,
      data: seriesData,
    },
  ];
}

export function get_chart_series_yoy({
  data = null,
  property_path = null,
  param_id = null,
  geoentity_id = null,
  start_mm = "01",
  start_dd = "01",
  name = "",
  filter_function = (x) => true,
  transform_function = (x) => x,
}) {
  const seriesData = [];
  const paramData = data[geoentity_id].param_values[param_id];

  // Extract the start year using the start_mmdd parameter and minumum key in the paramData using Math.min
  var minKey = Math.min(...Object.keys(paramData));
  const startYear = new Date(minKey * 1000).getFullYear();

  // Extract the end year using Math.max
  var maxKey = Math.max(...Object.keys(paramData));
  const endYear = new Date(maxKey * 1000).getFullYear();

  // Loop through each year starting from the start year
  for (let year = startYear; year <= endYear; year++) {
    const yearData = [];
    const startDate = new Date(year + "-" + start_mm + "-" + start_dd);
    const endDate = new Date(year + 1 + "-" + start_mm + "-" + start_dd);

    // Loop through each timestamp within the date range for the current year
    for (const timestamp in paramData) {
      const date = new Date(Number(timestamp) * 1000);
      if (date >= startDate && date < endDate) {
        const meanValue = paramData[timestamp][property_path];
        // If the mean value is null or the filter function returns false, skip this value
        if (meanValue === null || !filter_function(meanValue)) {
          continue;
        }

        // create a new date with same mm and dd of date and year as 1970
        var dateToPush = new Date(1970, date.getMonth(), date.getDate());
        var timestampToPush = dateToPush.getTime();
        yearData.push([timestampToPush, transform_function(meanValue)]);
      }
    }

    // sort the yearData array by timestamp
    yearData.sort((a, b) => a[0] - b[0]);

    // Add the year's data to the series data array
    if (yearData.length > 0) {
      var series_name = "";
      if (start_mm == "01" && start_dd == "01") {
        series_name = year.toString() + " " + name;
      } else {
        series_name =
          year.toString() + "-" + (year + 1).toString() + " " + name;
      }

      seriesData.push({
        name: series_name,
        data: yearData,
      });
    }
  }

  return seriesData;
}

export async function get_geoentity_param_values({
  geoentity_source_id = "",

  prefix = "",
  params = "",
  from_time = null,
  to_time = null,
  from_month = null,
  to_month = null,
  from_day = null,
  to_day = null,
  geom = null,
  query = null,
  aux = null,
  bbox = null,
  print_url = false,
  geoentity_aux_filter = "",
  geoentity_id = ""
}) {
  let url =
    base_url + "geoentity-sources/" + geoentity_source_id + "/params/values";
  let funcparams = {};

  // throw error if prefix is not provided
  if (!prefix && !geoentity_id) {
    throw new Error("prefix or geoentity_id is required");
  }

  // throw error if params is not provided
  if (!params) {
    throw new Error("params is required");
  }

  if(prefix){
    funcparams["prefix"] = prefix;
  }
  else{
    funcparams["geoentity_id"] = geoentity_id;
  }
  
  funcparams["params"] = params;

  if (from_time) {
    funcparams["from_time"] = from_time;
  }

  if (to_time) {
    funcparams["to_time"] = to_time;
  }

  if (from_month) {
    funcparams["from_month"] = from_month;
  }
  if (to_month) {
    funcparams["to_month"] = to_month;
  }

  if (from_day) {
    funcparams["from_day"] = from_day;
  }

  if (to_day) {
    funcparams["to_day"] = to_day;
  }

  if (geom) {
    funcparams["geom"] = geom;
  }

  if (bbox) {
    funcparams["bbox"] = bbox.join(",");
  }

  if (query) {
    funcparams["query"] = query;
  }

  if (aux) {
    funcparams["geo_aux"] = aux;
  }
  // set suppress_geom to 1 if geom is not provided
  if (!geom) {
    funcparams["suppress_geom"] = 1;
  }

  if (geoentity_aux_filter) {
    funcparams["geoentity_aux_filter"] = geoentity_aux_filter;
  }

  let response = await fetch(url + "?" + new URLSearchParams(funcparams));
  let res = await response.json();

  // Create a new Request object with url and params and print prepared url
  if (print_url) {
    let request = new Request(url + "?" + new URLSearchParams(funcparams), {
      method: "GET",
    });
    let prepared_url = request.url;
    // console.log("FETCH URL", prepared_url);
  }

  if (response.status == 200) {
    if ("data" in res) {
      return res["data"];
    } else {
      return res;
    }
  } else {
    return null;
  }
}
export async function get_geoentity_otf_param_values({
  geoentity_source_id = "",
  prefix = "",
  params = "",
  geom = null,
  args = null,
  print_url = false,
}) {
  if (!params) {
    throw new Error("params is required");
  }

  if (!args) {
    throw new Error("args is required");
  }

  let url =
    base_url +
    "geoentity-sources/" +
    geoentity_source_id +
    "/otf-params/" +
    params +
    "/values";

  let funcparams = {};

  // throw error if prefix is not provided
  if (!prefix) {
    throw new Error("prefix is required");
  }

  // throw error if params is not provided

  funcparams["prefix"] = prefix;
  // funcparams["params"] = params;
  funcparams["args"] = args;

  // set suppress_geom to 1 if geom is not provided
  if (!geom) {
    funcparams["suppress_geom"] = 1;
  }

  let response = await fetch(url + "?" + new URLSearchParams(funcparams));
  let res = await response.json();

  // Create a new Request object with url and params and print prepared url
  if (print_url) {
    let request = new Request(url + "?" + new URLSearchParams(funcparams), {
      method: "GET",
    });
    let prepared_url = request.url;
    // console.log("FETCH URL", prepared_url);
  }

  if (response.status == 200) {
    if ("data" in res) {
      return res["data"];
    } else {
      return res;
    }
  } else {
    return null;
  }
}

export async function get_available_dates({
  geoentity_source_id = "",
  params = "",
  from_time = null,
  to_time = null,
  geom = null,
  query = null,
  bbox = null,
  print_url = false,
}) {
  let url =
    base_url +
    "geoentity-sources/" +
    geoentity_source_id +
    "/params/timestamps";
  let funcparams = {};

  // throw error if params is not provided
  if (!params) {
    throw new Error("params is required");
  }

  funcparams["params"] = params;

  if (from_time) {
    funcparams["from_time"] = from_time;
 
  }else{
    funcparams["from_time"]="1683503800"
  }

  if (to_time) {
    funcparams["to_time"] = to_time;
  }

  if (geom) {
    funcparams["geom"] = geom;
  }

  if (bbox) {
    funcparams["bbox"] = bbox.join(",");
  }

  if (query) {
    funcparams["query"] = query;
  }

  // set suppress_geom to 1 if geom is not provided
  if (!geom) {
    funcparams["suppress_geom"] = 1;
  }

  console.log('Function params',funcparams);
  let response = await fetch(url + "?" + new URLSearchParams(funcparams));
  let res = await response.json();

  // Create a new Request object with url and params and print prepared url
  if (print_url) {
    let request = new Request(url + "?" + new URLSearchParams(funcparams), {
      method: "GET",
    });
    let prepared_url = request.url;
    // console.log("FETCH URL", prepared_url);
  }

  if (response.status == 200) {
    if ("data" in res) {
      return res["data"];
    } else {
      return res;
    }
  } else {
    return null;
  }
}

export async function get_geoentities({
  geoentity_source_id = 3,
  prefix = "AAAAA",
  geom = null,
  parents = null,
  geoentity_aux_filter = null,
  bbox = null,
}) {
  const url = `${base_url}geoentity-sources/${geoentity_source_id}/geoentities`;
  const params = new URLSearchParams();
  if (prefix) {
    params.append("prefix", prefix);
  }
  if (geom) {
    params.append("geom", geom);
  }
  if (parents) {
    params.append("parents", parents);
  }
  if (geoentity_aux_filter) {
    params.append("geoentity_aux_filter", geoentity_aux_filter);
  }
  if (bbox) {
    params.append("bbox", bbox.join());
  }
  const response = await fetch(url + "?" + params);
  if (response.ok) {
    const data = await response.json();
    return data.data || data;
  } else {
    return null;
  }
}
