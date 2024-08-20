// defining constants
const SHEET_ID = "1V3c2-kDkehR_ViJdsJsgWkpK9vAn233j6Gm7lPOVueM";
const SHEET_TITLE = "mosque_table";
const ROW_COUNT_URL = "https://docs.google.com/spreadsheets/d/" + SHEET_ID + "/gviz/tq?sheet=" + SHEET_TITLE + "&range=A1:A1";
// https://docs.google.com/spreadsheets/d/1V3c2-kDkehR_ViJdsJsgWkpK9vAn233j6Gm7lPOVueM/gviz/tq?sheet=mosque_table&range=A1:K21

window.onload = async function () {
  try {
    const table = await fetchDataFromSheet();
    // console.log(table);

    for (let i = 0; i < table.length; i++) {
      let mosque = document.createElement("div");
      mosque.id = i;
      if (i % 2 == 0) {
        mosque.classList.add("flex", "flex-row", "m-1", "bg-gray-500");
      } else {
        mosque.classList.add("flex", "flex-row", "m-1", "bg-gray-400");
      }
      document.getElementById("time-table").append(mosque);

      let name = document.createElement("div");
      name.classList.add("w-64", "md:w-96", "pl-2", "text-left")
      name.innerText = table[i]?.name ?? "";
      document.getElementById(i)?.append(name);

      let jumah = document.createElement("div");
      jumah.classList.add("w-16", "md:w-32");
      jumah.innerText = table[i]?.jumah?.toString()?.replace("-", ":") ?? "";
      document.getElementById(i)?.append(jumah);


      let fajr = document.createElement("div");
      fajr.classList.add("w-16", "md:w-32");
      fajr.innerText = table[i]?.fajr?.toString()?.replace("-", ":") ?? "";
      document.getElementById(i)?.append(fajr);


      let zuhr = document.createElement("div");
      zuhr.classList.add("w-16", "md:w-32");
      zuhr.innerText = table[i]?.zuhr?.toString()?.replace("-", ":") ?? "";
      document.getElementById(i)?.append(zuhr);

      let asr = document.createElement("div");
      asr.classList.add("w-16", "md:w-32");
      asr.innerText = table[i]?.asr?.toString()?.replace("-", ":") ?? "";
      document.getElementById(i)?.append(asr);

      let maghrib = document.createElement("div");
      maghrib.classList.add("w-16", "md:w-32");
      maghrib.innerText = table[i]?.maghrib?.toString()?.replace("-", ":") ?? "";
      document.getElementById(i)?.append(maghrib);

      let isha = document.createElement("div");
      isha.classList.add("w-16", "md:w-32");
      isha.innerText = table[i]?.isha?.toString()?.replace("-", ":") ?? "";
      document.getElementById(i)?.append(isha);
    }
  } catch (error) {
    console.error("Error occurred in onload function:", error);
  }
};

async function fetchDataFromSheet() {
  try {
    let rowCount = await fetch(ROW_COUNT_URL);
    if (!rowCount.ok) {
      throw new Error(`Failed to fetch sheet data: ${rowCount.statusText}`);
    }
    rowCount = await rowCount.text();
    rowCount = rowCount.substr(47).slice(0, -2);
    rowCount = JSON.parse(rowCount);
    rowCount = rowCount.table.rows[0].c[0].v;

    const SHEET_RANGE = "A1:K" + rowCount;
    const FULL_URL = "https://docs.google.com/spreadsheets/d/" + SHEET_ID + "/gviz/tq?sheet=" + SHEET_TITLE + "&range=" + SHEET_RANGE;

    const res = await fetch(FULL_URL);
    if (!res.ok) {
      throw new Error(`Failed to fetch sheet data: ${res.statusText}`);
    }

    const rep = await res.text();
    const dataJson = rep.substr(47).slice(0, -2);
    const data = JSON.parse(dataJson);
    const rawTable = data.table.rows;
    rawTable.shift();
    console.log(rawTable);
    const table = rawTable.map(row => ({
      name: row.c[1].v,
      area: row.c[2].v,
      latitude: row.c[3].v,
      longitude: row.c[4].v,
      jumah: row.c[5].v,
      fajr: row.c[6].v,
      zuhr: row.c[7].v,
      asr: row.c[8].v,
      maghrib: row.c[9].v,
      isha: row.c[10].v,
    }));
    return table;
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    throw error;
  }
}
