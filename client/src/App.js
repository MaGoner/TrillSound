import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { HomePage } from './components/client/pages/HomePage';
import { AlphabeticalOrder } from './components/client/layouts/homepage layouts/AlphabeticalOrder';
import { NewUploads } from './components/client/layouts/homepage layouts/NewUploads';
import { AllArtists } from './components/client/pages/artist page/AllArtists';
import { ArtistPage } from './components/client/pages/ArtistPage';
import './style/App.css';
import './style/Admin.css';
import { NotFound } from './components/client/pages/NotFound';
import { SongPage } from './components/client/pages/SongPage';
// import { AlbumPage } from './components/client/pages/AlbumPage';
import { Dashboard } from './components/admin/pages/Dashboard';
import { Login } from './components/admin/pages/Login';
import { ArtistBios } from './components/admin/pages/ArtistBios';
import { ChangePassword } from './components/admin/pages/ChangePassword';
import { AddSong } from './components/admin/pages/AddSong';
import { AddArtist } from './components/admin/pages/AddArtist';
import { GlobalProvider } from './context/global state/GlobalState';
import { WorshipPage } from './components/client/pages/genres page/Worship';
import { PraisePage } from './components/client/pages/genres page/Praise';
import { RapPage } from './components/client/pages/genres page/Rap';
import { PraiseAlphOrder } from './components/client/layouts/genres layout/praise sort/AlphOrder';
import { WorshipAlphOrder } from './components/client/layouts/genres layout/worship sort/AlphOrder';
import { RapAlphOrder } from './components/client/layouts/genres layout/rap sort/AlphOrder';
import { PraiseTrending } from './components/client/layouts/genres layout/praise sort/Trending';
import { RapTrending } from './components/client/layouts/genres layout/rap sort/Trending';
import { WorshipTrending } from './components/client/layouts/genres layout/worship sort/Trending';
import { HelmetProvider } from 'react-helmet-async';
import { Register } from './components/admin/pages/Register';
import { ArtistAlphOrder } from './components/client/layouts/allartist layout/AlphabeticalOrder';
import { NewArtistUploads } from './components/client/layouts/allartist layout/RecentlyUploaded';

function App() {
  return (
    <HelmetProvider>
      <GlobalProvider>
        <Router>
          <Switch>
            <Route exact path='/' component={HomePage} />
            <Route path='/alph' component={AlphabeticalOrder} />
            <Route path='/new-uploads' component={NewUploads} />
            <Route exact path='/artists' component={AllArtists} />
            <Route path='/artists/new-uploads' component={NewArtistUploads} />
            <Route path='/artists/alph' component={ArtistAlphOrder} />
            <Route path='/artist' component={ArtistPage} />
            <Route path='/song' component={SongPage} />
            {/* <Route path='/album' component={AlbumPage} /> */}
            <Route exact path='/genre/worship' component={WorshipPage} />
            <Route exact path='/genre/praise' component={PraisePage} />
            <Route exact path='/genre/rap' component={RapPage} />
            <Route path='/genre/praise/alph' component={PraiseAlphOrder} />
            <Route path='/genre/rap/alph' component={RapAlphOrder} />
            <Route path='/genre/worship/alph' component={WorshipAlphOrder} />
            <Route path='/genre/praise/trending' component={PraiseTrending} />
            <Route path='/genre/rap/trending' component={RapTrending} />
            <Route path='/genre/worship/trending' component={WorshipTrending} />
            {/* admin routes */}
            <Route exact path='/admin/songs' component={Dashboard} />
            <Route exact path='/admin/artists' component={ArtistBios} />
            <Route exact path='/admin' component={Login} />
            <Route path='/admin/register' component={Register} />
            <Route path='/admin/change-password' component={ChangePassword} />
            <Route path='/admin/add-song' component={AddSong} />
            <Route path='/admin/add-artist' component={AddArtist} />
            <Route component={NotFound} />
          </Switch>
        </Router>
      </GlobalProvider>
    </HelmetProvider>
  );
}
export default App;
