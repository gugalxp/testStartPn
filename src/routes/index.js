
import { Switch } from 'react-router-dom';
import Route from './Route';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';

import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import Customers from '../pages/Customers';
import New from '../pages/New';
import ForgotPassword from '../pages/ForgotPassword';
import EmailSent from '../pages/EmailSent';
import NewPassword from '../pages/NewPassword';

export default function Routes(){
  return(
    <Switch>
      <Route exact path="/" component={SignIn} />
      <Route exact path="/register" component={SignUp} />
      <Route exact path="/forgotPassword" component={ForgotPassword} />
      <Route exact path="/emailSent" component={EmailSent} />
      <Route exact path="/newPassword" component={NewPassword} />
      

      <Route exact path="/dashboard" component={Dashboard} />
      <Route exact path="/profile" component={Profile} />
      <Route exact path="/customers" component={Customers}  />
      <Route exact path="/new" component={New}  />
      <Route exact path="/new/:id" component={New}  />


    </Switch>
  )
}