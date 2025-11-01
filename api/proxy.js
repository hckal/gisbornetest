export default async function handler(req, res) {
  const { type, lat, lon, lng1, lat1, lng2, lat2 } = req.query;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (type === 'mapbox_token') {
      return res.status(200).json({ 
        token: process.env.MAPBOX_TOKEN 
      });
    }

    if (type === 'weather') {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.OPENWEATHER_KEY}`
      );
      const data = await response.json();
      return res.status(200).json(data);
    }

    if (type === 'directions') {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${lng1},${lat1};${lng2},${lat2}?access_token=${process.env.MAPBOX_TOKEN}&overview=full&geometries=geojson`
      );
      const data = await response.json();
      return res.status(200).json(data);
    }

    return res.status(400).json({ error: 'Invalid type parameter' });
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ error: error.message });
  }
}
