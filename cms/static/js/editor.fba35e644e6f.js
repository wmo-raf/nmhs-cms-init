var a = "{{city_ls|safe}}";

const data = [
    ['Khartoum', '05-02-2023', 11, 27, 5, 90, 'Light rain'],
  ];
  
  const container = document.querySelector('#example');
  const hot = new Handsontable(container, {
    data: data,
    rowHeaders: true,
    colHeaders: ['City', 'Date', 'Min Temperature (°C)', 'Max Temperature (°C)', 'Wind Speed (km/h)', 'Wind Direction (°)', 'General Condition'],
    columns: [
      {
        type: 'dropdown',
        source: ['Khartoum', 'Nairobi', 'Kisumu']
      },
      {
        type: 'date',
      },
      {},
      {},
      {},
      {},
      {
        type: 'dropdown',
        source: ['Light rain', 'Partly cloudy', 'Heavy Rain']
      },
    ],
    // dropdownMenu: true,
    // multiColumnSorting: true,
    // filters: true,
    minSpareRows: 50,
    height: '60vh',
    width: 'auto',
    licenseKey: 'non-commercial-and-evaluation' // for non-commercial use only
});