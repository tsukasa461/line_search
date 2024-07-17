import React, { useState } from 'react';
import { Container, Typography, Box, Select, MenuItem, FormControl, InputLabel, TextField, Button, Grid, Slider } from '@mui/material';
import prefectures from './Prefecture';
import liff from '@line/liff';
import axios from 'axios';

const SearchForm = () => {
  useEffect(() => {
    const initializeLiff = async () => {
      try {
        await liff.init({ liffId: '2005806957-qwJxnNGN' });
      } catch (err) {
        console.log('LIFF initialization failed', err);
      }
    };

    initializeLiff();
  }, []);

  const [selectedPrefecture, setSelectedPrefecture] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [priceRange, setPriceRange] = useState([5000, 10000]);
  const [keyword, setKeyword] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date()); // 初期値を startDate と同じに設定

  

  const handleStartDateChange = (event) => {
    const newStartDate = new Date(event.target.value);
    setStartDate(newStartDate);
    // 開始日が変更された場合、終了日が開始日より前なら開始日に合わせる
    if (endDate < newStartDate) {
      setEndDate(newStartDate);
    }
  };

  const handleEndDateChange = (event) => {
    const newEndDate = new Date(event.target.value);
    // 終了日が開始日以降であることを確認
    if (newEndDate >= startDate) {
      setEndDate(newEndDate);
    }
  };


  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    // 検索ロジックをここに追加
    const sendData = [selectedPrefecture, selectedCity, priceRange[0], priceRange[1], keyword, startDate, endDate];
    try {
      await axios.post('https://script.google.com/macros/s/AKfycbxnbK6ALmBsXU2aj24ef2rDivvrpwNdoS9rifdEBtgSXgW6vy4VEzxyoB9jTn7b8w/exec', sendData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    // LIFFアプリを閉じる
    if (liff.isInClient()) {
      liff.closeWindow();
    } else {
      console.log('This is not running in LIFF browser');
    }
  };

  const getCities = (prefecture) => {
    const selected = prefectures.find(p => p.name === prefecture);
    return selected ? selected.cities : [];
  };

  return (
    <Container maxWidth="sm">
      <Box>
        <Typography variant="h4" sx={{ fontWeight : 'bold' }} component="h1" gutterBottom>
          検索フォーム
        </Typography>
        </Box>
        <Box className="coponentBackground" >
        <Typography variant="h6" sx={{ fontWeight : 'bold' }} id="location" gutterBottom>
          地域
        </Typography>
        <form onSubmit={handleSearch}>
          <FormControl fullWidth margin="normal">
            <InputLabel>都道府県</InputLabel>
            <Select
              value={selectedPrefecture}
              onChange={(e) => {
                setSelectedPrefecture(e.target.value);
                setSelectedCity('');
              }}
              label="都道府県"
            >
              <MenuItem value="">都道府県を入力</MenuItem>
              {prefectures.map((prefecture) => (
                <MenuItem key={prefecture.name} value={prefecture.name}>
                  {prefecture.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>市町村</InputLabel>
            <Select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              label="市町村"
              disabled={!selectedPrefecture}
            >
              <MenuItem value="">市町村を入力</MenuItem>
              {getCities(selectedPrefecture).map((city) => (
                <MenuItem key={city} value={city}>
                  {city}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box className="coponentBackground" >
            <Typography variant="h6" sx={{ fontWeight : 'bold' }} id="date-range" gutterBottom>
              期間
            </Typography>
            <Grid container spacing={2} alignItems="center">
        <Grid item xs={6}>
          <TextField
            label="開始日"
            type="date"
            value={startDate.toISOString().split('T')[0]}
            onChange={handleStartDateChange}
            InputLabelProps={{ shrink: true }}
            sx={{ width: '100%' }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="終了日"
            type="date"
            value={endDate.toISOString().split('T')[0]}
            onChange={handleEndDateChange}
            InputLabelProps={{ shrink: true }}
            sx={{ width: '100%' }}
            inputProps={{ min: startDate.toISOString().split('T')[0] }}
          />
        </Grid>
      </Grid>
          </Box>
          <Box className="coponentBackground" >
            <Typography variant="h6" sx={{ fontWeight : 'bold' }} id="range-slider" gutterBottom>
              料金範囲
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={5}>
                <Typography variant="body1" align="center">
                  {new Intl.NumberFormat().format(priceRange[0])}円
                </Typography>
              </Grid>
              <Grid item xs={2} style={{ textAlign: 'center' }}>
                <Typography variant="h6">～</Typography>
              </Grid>
              <Grid item xs={5}>
                <Typography variant="body1" align="center">
                  {new Intl.NumberFormat().format(priceRange[1])}円
                </Typography>
              </Grid>
            </Grid>
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              step={1000}
              min={5000}
              max={100000}
              sx={{ mt: 2 }}
            />
          </Box>
          <div >
          <TextField
            label="フリーワード"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          </div>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            検索
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default SearchForm;
