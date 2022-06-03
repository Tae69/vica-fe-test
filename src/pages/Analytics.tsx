import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { CircularProgress, Container, Grid, Paper, Typography } from '@mui/material';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ChartData } from 'chart.js';
import Page from '../components/Page';
import TopBar from '../components/TopBar';
import api from '../mocks/analyticApi';
import useApi from '../hooks/useApi';

ChartJS.register(CategoryScale, LinearScale, BarElement);

function Analytics() {
  const options = {
    indexAxis: 'y' as const,
    scale: {
      ticks: {
        precision: 0
      }
    },
    scales: {
      y: {
        ticks: {
          autoSkip: false
        }
      }
    },
    elements: {
      bar: {
        borderWidth: 2
      }
    },
    responsive: true
  };

  const [byGenreData, setByGenreData] = useState<ChartData<'bar', number[], string> | null>(null);
  const [byYearData, setByYearData] = useState<ChartData<'bar', number[], string> | null>(null);
  const [loading, setLoading] = useState(false);

  const token = useApi();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.getBookCountBy('genre', token),
      api.getBookCountBy('yearPublished', token)
    ]).then(([genres, years]) => {
      setByGenreData(genres);
      setByYearData(years);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <TopBar />
      <Page>
        <Container sx={{ p: 0 }}>
          {loading && <CircularProgress sx={{ mt: 2 }} />}
          {!loading && byGenreData && byYearData && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ mt: 2, p: 2 }}>
                  <Typography variant="h5">Books by Genre</Typography>
                  <Bar options={options} data={byGenreData} />
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ mt: 2, p: 2 }}>
                  <Typography variant="h5">Books by Year Published</Typography>
                  <Bar options={options} data={byYearData} />
                </Paper>
              </Grid>
            </Grid>
          )}
        </Container>
      </Page>
    </>
  );
}

export default Analytics;
